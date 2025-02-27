import TopNav from "./TopNav";
import Link from "next/link";


export default function Header() {
	return (
		<div className="header flex flex-row items-center justify-evenly w-full bg-gray-800 py-3 sticky top-0 z-10">
			<div className="logo">
				<Link className="text-white" href="/">A11y <strong>Pros</strong></Link>
			</div>
			<TopNav/>
		</div>
	  );
};