import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer.js";
export const metadata = {
	title: "Next Погода",
	description:
		"Вы можете узнать какую одежду лучше одеть по погоде, на этом сайте.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="ru">
			<body>
				<main className="main">
					{children}
					<Footer className="footer" />
				</main>
				<Analytics />
			</body>
		</html>
	);
}
