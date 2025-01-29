import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href="/">
        <button>Go Back Home</button>
      </Link>
    </div>
  );
}