import Link from 'next/link';

interface CompliancesProps {
	showHeading?: boolean;
}

const Heading = ({
	children,
	showHeading,
  }: {
	children: React.ReactNode;
	showHeading?: boolean | undefined;
  }) => {
	const Tag = showHeading ? "h3" : "h2";
	return <Tag>{children}</Tag>;
  };

  const Compliances = ({ showHeading }: CompliancesProps) => (
	<section className="compliance-container">
			<div className="compliance-content">
				<h2 className="text-center text-2xl sm:text-3xl md:text-4xl">Accessibility Compliance Expertise</h2>
				<p className="text-xl">
	  				We provide expert guidance to help your organization meet digital accessibility requirements under both national and international accessibility standards. Our team ensures your website, applications, and digital documents are inclusive, compliant, and usable for all individuals.
				</p>
			</div>
			<div className="compliance-grid">
				<Link href="/compliance/web-content-accessibility-guidelines" className="bg-[#0E8168]">
					<div className="compliance-block">
						<Heading showHeading={showHeading}>WCAG</Heading>
						<p className="p-0 m-0">Web Content Accessibility Guidelines</p>
					</div>
				</Link>
				<Link href="/compliance/the-americans-with-disabilities-act" className="bg-[#DA3940]">
					<div className="compliance-block">
						<Heading showHeading={showHeading}>ADA</Heading>
						<p>Americans With Disabilities Act</p>
					</div>
				</Link>
				<Link href="/compliance/section-508" className=" bg-[#872E0F]">
				<div className="compliance-block">
					<Heading showHeading={showHeading}>Section 508</Heading>
					<p>US Rehabilitation Act</p>
				</div>
				</Link>
				<Link href="/compliance/the-accessible-canada-act-aca/" className=" bg-[#6B660D]">
				<div className="compliance-block">
					<Heading showHeading={showHeading}>ACA</Heading>
					<p>Accessible Canada Act</p>
				</div>
				</Link>
				<Link href="/compliance/aoda" className="bg-[#0F7987]">
				<div className="compliance-block">
					<Heading showHeading={showHeading}>AODA</Heading>
					<p>Accessibility for Ontarians with Disabilities Act</p>
				</div>
				</Link>
				<Link href="/compliance/en-301-549" className="bg-[#0F5387]">
				<div className="compliance-block">
					<Heading showHeading={showHeading}>EN 301 549</Heading>
					<p>European Standard for Digital Accessibility</p>
				</div>
				</Link>
			</div>
			
		</section>
  );

  export default Compliances;