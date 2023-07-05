import { NextResponse } from "next/server";
export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const adress = searchParams.get("q") ?? "New York";
	const lang = searchParams.get("lang") ?? "ru";
	const days = searchParams.get("days") ?? 1;
	let status;
	let weather;
	try {
		weather = await getWeather(adress, days, lang);
		status = 200;
	} catch {
		status = 500;
		weather = { message: "Fetch weather error." };
	} finally {
		return NextResponse.json(weather, { status });
	}
}

async function getWeather(city, days, lang) {
	const data = await fetch(
		`https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API}&q=${city}&days=${days}&lang=${lang}`
	);

	return data.json();
}
