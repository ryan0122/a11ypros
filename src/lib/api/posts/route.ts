import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/posts`, {
		cache: 'no-store',
		headers: {
		  Authorization: `${process.env.NEXT_PUBLIC_WP_AUTH}`
		},
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