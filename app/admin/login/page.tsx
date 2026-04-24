import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="container page-section admin-login">
      <h1>Admin Login</h1>
      <p>Sign in with Google to access the ArtTech24 dashboard.</p>
      <Link className="btn" href="/api/auth/signin/google?callbackUrl=/admin">
        Continue with Google
      </Link>
    </main>
  );
}
