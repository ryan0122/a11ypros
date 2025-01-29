import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://cms.a11ypros.com/wp-json/wp/v2", {
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const posts = await response.json();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}