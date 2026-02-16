import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // セキュリティ上、ユーザーが存在しない場合も成功レスポンスを返す
      return NextResponse.json({
        message: 'If the email exists, a reset link will be sent',
      });
    }

    // 既存の未使用トークンを無効化
    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        used: false,
        expiresAt: { gt: new Date() },
      },
      data: { used: true },
    });

    // 新しいリセットトークンを生成（24時間有効）
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // 実際の実装ではメール送信処理を追加
    // await sendResetEmail(email, token);

    return NextResponse.json({
      message: 'If the email exists, a reset link will be sent',
      token, // デモ用に返却（本番では削除）
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
