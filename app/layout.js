import "./globals.css";
export const metadata = {
	title: "Next Weather",
	description: "You can get clothes by weather in this site",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
