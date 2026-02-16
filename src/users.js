const bcrypt = require('bcrypt');

// ダミーユーザーデータ（実際の実装ではデータベースを使用）
const users = [
  {
    id: 1,
    email: 'user@example.com',
    // パスワード: password123
    passwordHash: '$2b$10$Kzws86hy/I9aj/L17jzCzOm/4IgDD7F5Bvw7E0sydNCcdsMuwd7t.',
  },
];

async function findUserByEmail(email) {
  return users.find(user => user.email === email);
}

async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

module.exports = {
  findUserByEmail,
  verifyPassword,
};
