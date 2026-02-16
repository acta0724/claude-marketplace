export default function Home() {
  return (
    <main>
      <h1>Password Reset Demo</h1>
      <p>API Endpoints:</p>
      <ul>
        <li>POST /api/auth/reset-password - Request password reset</li>
        <li>POST /api/auth/reset-password/confirm - Confirm password reset</li>
      </ul>
    </main>
  );
}
