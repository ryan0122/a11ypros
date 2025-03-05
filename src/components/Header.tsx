import TopNav from "./TopNav";
import Link from "next/link";


export default function Header() {
	return (
		<div className="header flex flex-row items-center justify-evenly w-full py-3 sticky top-0 z-10">
			<div className="logo">
				<Link className="text-white hover:text-[#d4e300]" href="/">A11Y <strong>PROS</strong></Link>
			</div>
			<TopNav/>
			{/* Mobile navigation */}
			  <div className="hidden" role="dialog" aria-modal="true">
			   
			    <div className="fixed inset-0 z-10"></div>
			    <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
			      <div className="flex items-center justify-between">
			        <a href="#" className="-m-1.5 p-1.5">
			          <span className="sr-only">A11Y Pros</span>
					  {/* Logo here */}
			          
			        </a>
			        <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700">
			          <span className="sr-only">Close menu</span>
			          <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
			            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
			          </svg>
			        </button>
			      </div>
			      <div className="mt-6 flow-root">
			        <div className="-my-6 divide-y divide-gray-500/10">
			          <div className="space-y-2 py-6">
			            <div className="-mx-3">
			              
			            </div>
			            <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Features</a>
			            <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Marketplace</a>
			            <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Company</a>
			          </div>
			        </div>
			      </div>
			    </div>
			</div>
		</div>
	  );
};