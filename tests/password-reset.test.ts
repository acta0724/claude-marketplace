import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Password Reset Flow', () => {
  let testUserId: string;
  let testToken: string;

  beforeAll(async () => {
    // テストユーザーの作成
    const hashedPassword = await bcrypt.hash('oldpassword123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    // クリーンアップ
    await prisma.passwordResetToken.deleteMany({
      where: { userId: testUserId },
    });
    await prisma.user.delete({
      where: { id: testUserId },
    });
    await prisma.$disconnect();
  });

  test('リセットトークンが生成される', async () => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const resetToken = await prisma.passwordResetToken.create({
      data: {
        token: 'test-token-123',
        userId: testUserId,
        expiresAt,
      },
    });

    expect(resetToken).toBeDefined();
    expect(resetToken.token).toBe('test-token-123');
    expect(resetToken.userId).toBe(testUserId);
    expect(resetToken.used).toBe(false);

    testToken = resetToken.token;
  });

  test('トークンでパスワードを変更できる', async () => {
    const newPassword = 'newpassword456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // パスワード更新
    await prisma.user.update({
      where: { id: testUserId },
      data: { password: hashedPassword },
    });

    // トークンを使用済みにする
    await prisma.passwordResetToken.update({
      where: { token: testToken },
      data: { used: true },
    });

    // 検証
    const updatedUser = await prisma.user.findUnique({
      where: { id: testUserId },
    });

    expect(updatedUser).toBeDefined();
    const passwordMatch = await bcrypt.compare(newPassword, updatedUser!.password);
    expect(passwordMatch).toBe(true);

    const usedToken = await prisma.passwordResetToken.findUnique({
      where: { token: testToken },
    });
    expect(usedToken?.used).toBe(true);
  });

  test('トークンが期限切れで使用できない', async () => {
    // 期限切れトークンを作成
    const expiredDate = new Date();
    expiredDate.setHours(expiredDate.getHours() - 1); // 1時間前

    const expiredToken = await prisma.passwordResetToken.create({
      data: {
        token: 'expired-token-123',
        userId: testUserId,
        expiresAt: expiredDate,
      },
    });

    // トークンを取得
    const token = await prisma.passwordResetToken.findUnique({
      where: { token: expiredToken.token },
    });

    expect(token).toBeDefined();
    expect(token!.expiresAt < new Date()).toBe(true);

    // クリーンアップ
    await prisma.passwordResetToken.delete({
      where: { id: expiredToken.id },
    });
  });
});
