import { NextResponse } from "next/server";


const authHeader = "Basic YTExeXByb2NtczpOQlZPIHRkOFogSHlxTyBoVmYzIHVtVEEgZkhjUg==";

export async function getPosts() {
  try {
    const response = await fetch("https://cms.a11ypros.com/wp-json/wp/v2/posts", {
		cache: 'no-store',
		headers: {
		  Authorization: authHeader,
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