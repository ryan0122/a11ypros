import { NextResponse } from "next/server";

export async function getPosts() {
  try {
    const response = await fetch(`${process.env.CMS_URL}/posts`, {
		cache: 'no-store',
		headers: {
		  Authorization: `${process.env.WP_AUTH}`
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