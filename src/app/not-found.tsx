import Link from "next/link";
import IconNotFound from "@/components/icons/IconNotFound";

export default function NotFound() {
  return (
    <div className="not-found-container text-center page-container max-w-6xl mx-auto p-8 font-[family-name:var(--font-inter)] mb-10">
      <h1 className="text-4xl font-semibold mb-6 text-center">404 - Page Not Found</h1>
      <div className="text-center mx-auto w-3/5 h-2/5 flex justify-center items-center">
        <IconNotFound width={400} height={250}/>
      </div>
        
      <p className="text-2xl my-10">Sorry, the page you are looking for does not exist.</p>
      <Link className="text-2xl rounded-md border-2 border-[#0f866c] py-2 px-4 mt-8 inline-block font-semibold" href="/">Return to Home</Link>
    </div>
  );
}