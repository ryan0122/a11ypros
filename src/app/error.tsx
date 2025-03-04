"use client";

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Oops! Something went wrong.</h1>
      <p>{error.message}</p>
    </div>
  );
}