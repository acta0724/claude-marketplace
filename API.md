# Login API Documentation

## エンドポイント

### POST /api/auth/login

メールアドレスとパスワードによるログイン認証を行い、JWT トークンを発行します。

#### リクエスト

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### レスポンス

**成功 (200 OK)**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**エラー (400 Bad Request)** - 入力が不正な場合

```json
{
  "error": "Email and password are required"
}
```

**エラー (401 Unauthorized)** - 認証情報が不正な場合

```json
{
  "error": "Invalid email or password"
}
```

**エラー (500 Internal Server Error)** - サーバーエラー

```json
{
  "error": "Internal server error"
}
```

## セットアップ

1. 依存パッケージをインストール:
```bash
npm install
```

2. 環境変数を設定:
```bash
cp .env.example .env
# .env ファイルで JWT_SECRET を設定
```

3. サーバーを起動:
```bash
npm start
```

## テスト

```bash
npm test
```

## テストユーザー

- Email: `user@example.com`
- Password: `password123`

## セキュリティ

- パスワードは bcrypt でハッシュ化されています
- JWT トークンは 24 時間有効です
- 本番環境では JWT_SECRET を必ず設定してください
