const express = require('express');
const { findUserByEmail, verifyPassword } = require('../users');
const { generateToken } = require('../auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 入力バリデーション
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // ユーザー検索
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // パスワード検証
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // トークン生成
    const token = generateToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

module.exports = router;
