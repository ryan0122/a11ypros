import TopNav from "./TopNav";
import Link from "next/link";


export default function Header() {
	return (
		<div className="header flex flex-row items-center justify-evenly w-full">
			<div className="logo">
				<Link href="/">A11y <strong>Pros</strong></Link>
			</div>
			<TopNav/>
		</div>
	  );
};