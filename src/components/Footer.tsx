export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="footer flex flex-row items-center justify-evenly w-full">
			<p>&copy; {currentYear} A11Y Pros</p>
		</footer>
	  );
};