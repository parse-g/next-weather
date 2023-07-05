import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
export const metadata = {
	title: "Next Weather",
	description: "You can get clothes by weather in this site",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
