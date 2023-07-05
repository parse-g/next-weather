"use client";
import Image from "next/image";
import styles from "./WeatherBlock.module.css";
import { useEffect, useState } from "react";
async function getData(q, lang, days) {
	const res = await fetch(`/api/weather?q=${q}&lang=${lang}&days=${days}`);
	const data = await res.json();
	console.log(data);
	return data;
}
export default function WeatherBlock() {
	const [userdata, setUserdata] = useState({});

	const [weather, setWeather] = useState();

	useEffect(() => {
		const info = navigator;
		let { language } = info;
		if (language.includes("-")) language = language.split("-")[0];
		console.log("INFO", info);
		const getPos = () => {
			fetch("https://api.db-ip.com/v2/free/self")
				.then((res) => res.json())
				.then((data) => {
					const pos = data;
					const adress = `${pos.countryName},${pos.city}`;
					console.log({ pos, language, adress });
					setUserdata({ pos, language, adress });
				});
		};

		getPos();
	}, []);

	useEffect(() => {
		getData(userdata.adress, userdata.language, 1).then((data) =>
			setWeather(data)
		);

		console.log(userdata);
	}, [userdata]);
	return (
		<div>
			{" "}
			ADRESS:{userdata?.adress} <br /> Lang:{userdata?.language}
			<br />
			{weather?.error !== undefined ? (
				<div>
					Error! {weather.error.message} {weather.error.code}
				</div>
			) : weather?.forecast?.forecastday[0]?.date !== undefined ? (
				<section className={styles.mainSection}>
					<div>
						{weather.forecast.forecastday[0].date}
						{weather.forecast.forecastday[0].day.condition.text}
						<Image
							src={`https:${weather.forecast.forecastday[0].day.condition.icon}`}
							width={24}
							height={24}
							alt={weather.forecast.forecastday[0].day.condition.text}
						/>
						<br />
						ТЕМПЕРАТУРА:
						<br />
						МИНИМУМ: {weather.forecast.forecastday[0].day.mintemp_c}
						<br />
						МАКСИМУМ: {weather.forecast.forecastday[0].day.maxtemp_c}
						<br />
						СРЕДНЯЯ: {weather.forecast.forecastday[0].day.avgtemp_c}
						<br />
						{weather.forecast.forecastday[0].day["daily_will_it_rain"] ===
							1 && (
							<>
								<b>ОЖИДАЕТСЯ ДОЖДЬ</b> С ШАНСОМ{" "}
								<b>
									{weather.forecast.forecastday[0].day.daily_chance_of_rain}
								</b>
							</>
						)}
						{weather.forecast.forecastday[0].day["daily_will_it_snow"] ===
							1 && (
							<>
								<b>ОЖИДАЕТСЯ СНЕГ</b> С ШАНСОМ{" "}
								<b>
									{weather.forecast.forecastday[0].day.daily_chance_of_snow}
								</b>
							</>
						)}
					</div>
					<div>
						ВЕТЕР <br />
						МАКСИМАЛЬНЫЙ: {weather.forecast.forecastday[0].day.maxwind_kph}{" "}
						КМ/ЧАС
					</div>
					<div>
						СОНЦЕ <br />
						РАСВЕТ {weather.forecast.forecastday[0].astro.sunrise} <br />
						ЗАКАТ {weather.forecast.forecastday[0].astro.sunset} <br />
						<br />
						Луна <br />
						РАСВЕТ {weather.forecast.forecastday[0].astro.moonrise} <br />
						ЗАКАТ {weather.forecast.forecastday[0].astro.moonset} <br />
					</div>
				</section>
			) : (
				<>Loading...</>
			)}
		</div>
	);
}
