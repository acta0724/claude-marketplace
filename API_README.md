# Claude Marketplace API

## サインアップ API

### エンドポイント

```
POST /api/auth/signup
```

### リクエスト

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

### バリデーション

**Email:**
- 必須
- 有効なメールアドレス形式

**Password:**
- 必須
- 最低8文字
- 大文字を1文字以上含む
- 小文字を1文字以上含む
- 数字を1文字以上含む

### レスポンス

**成功 (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**エラー (400 Bad Request):**
```json
{
  "error": "Invalid email format"
}
```

エラーメッセージの例:
- `Email is required`
- `Invalid email format`
- `Password is required`
- `Password must be at least 8 characters long`
- `Password must contain at least one uppercase letter`
- `Password must contain at least one lowercase letter`
- `Password must contain at least one number`
- `User with this email already exists`

**エラー (500 Internal Server Error):**
```json
{
  "error": "Internal server error"
}
```

## セキュリティ

- パスワードは bcrypt でハッシュ化されて保存されます
- パスワードは平文で保存されません
- レスポンスにパスワードやパスワードハッシュは含まれません

## 開発

### インストール
```bash
npm install
```

### テスト
```bash
npm test
```

### 開発サーバー起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

### 本番サーバー起動
```bash
npm start
```
