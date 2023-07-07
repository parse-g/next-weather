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
	const [adressInput, setAdressInputValue] = useState("");
	const [pageReady, setPageReady] = useState(false);

	const [weather, setWeather] = useState();

	const uid = () =>
		String(Date.now().toString(32) + Math.random().toString(16)).replace(
			/\./g,
			""
		);

	const clothes = {
		sweater: {
			name: "Свитер",
			imageURL: "/clothes/11.png",
		},
		jacket: { name: "Курточка", imageURL: "/clothes/1.png" },
		"light jacket": { name: "Легкая курточка", imageURL: "/clothes/2.png" },
		"t-shirt": { name: "Футболка", imageURL: "/clothes/4.png" },
		shorts: { name: "Шорты", imageURL: "/clothes/12.png" },
		trousers: { name: "Штаны", imageURL: "/clothes/5.png" },
		underpants: { name: "Подштанники", imageURL: "/clothes/7.png" },
		raincoat: { name: "Дождевик", imageURL: "/clothes/8.png" },
		"fur coat": { name: "Шуба", imageURL: "/clothes/6.png" },
		cap: { name: "Шапка", imageURL: "/clothes/9.png" },
		hat: { name: "Кепка", imageURL: "/clothes/10.png" },
		scarf: { name: "Шарф", imageURL: "/clothes/3.png" },
	};

	function getClothes(temperature, isRain, isSnow) {
		if (isRain) return [clothes.trousers, clothes.sweater, clothes.raincoat];
		if (isSnow)
			return [
				clothes.trousers,
				clothes.underpants,
				clothes.sweater,
				clothes["fur coat"],
			];
		if (temperature < 0 && temperature > -10) {
			return [
				clothes.cap,
				clothes.jacket,
				clothes.sweater,
				clothes.trousers,
				clothes.underpants,
			];
		}
		if (temperature < -10) {
			return [
				clothes.cap,
				clothes.scarf,
				clothes["fur coat"],
				clothes.jacket,
				clothes.sweater,
				clothes.trousers,
				clothes.underpants,
			];
		}

		if (temperature >= 0 && temperature <= 10) {
			return [
				clothes.cap,
				clothes.scarf,
				clothes.jacket,
				clothes.sweater,
				clothes.trousers,
			];
		}
		if (temperature > 10 && temperature < 20) {
			return [clothes.cap, clothes["light jacket"], clothes.trousers];
		}
		if (temperature >= 20)
			return [clothes.hat, clothes["t-shirt"], clothes.shorts];
	}

	const getWeatherByHour = (hours, hoursForecast) => {
		const hoursObjects = [];
		hours.map((hour) => {
			hoursObjects.push(hoursForecast[hour]);
		});
		return hoursObjects;
	};

	useEffect(() => {
		const info = navigator;
		let { language } = info;
		// Splice language, expample ru-RU to ru
		if (language.includes("-")) language = language.split("-")[0];
		console.log("INFO", info);
		const getPos = () => {
			fetch("https://api.db-ip.com/v2/free/self")
				.then((res) => res.json())
				.then((data) => {
					const pos = data;
					const adress = `${pos.countryName},${pos.city}`;
					setAdressInputValue(adress);
					console.log({ pos, language, adress });
					setUserdata({ pos, language, adress });
				});
		};

		getPos();
	}, []);

	useEffect(() => {
		setPageReady(false);
		getData(userdata.adress, userdata.language, 1).then((data) => {
			setPageReady(true);
			setWeather(data);
			console.log(data);
		});

		console.log(userdata);
	}, [userdata]);
	return (
		<div>
			{" "}
			<label>
				ADRESS:
				<input
					type="text"
					value={adressInput}
					onChange={(e) => setAdressInputValue(e.target.value)}
					disabled={!pageReady}
				/>
			</label>
			<button
				onClick={() => {
					const adress = adressInput;
					setUserdata((prev) => {
						return { ...prev, adress };
					});
				}}
			>
				SUBMIT
			</button>
			<br /> Lang:{userdata?.language}
			<br />
			{weather?.error !== undefined ? (
				<div>
					Error! {weather.error.message} {weather.error.code}
				</div>
			) : weather?.forecast?.forecastday[0]?.date !== undefined ? (
				<section className={styles.weatherCard}>
					<div className={styles.mainData}>
						{weather.forecast.forecastday[0].date}
						<br />
						{weather.forecast.forecastday[0].day.condition.text}
						<Image
							src={`https:${weather.forecast.forecastday[0].day.condition.icon}`}
							width={48}
							height={48}
							quality={80}
							alt={weather.forecast.forecastday[0].day.condition.text}
						/>
					</div>
					<div className={styles.temperatureBlock}>
						<br />
						ТЕМПЕРАТУРА:
						<br />
						МИН: {weather.forecast.forecastday[0].day.mintemp_c}
						МАКС: {weather.forecast.forecastday[0].day.maxtemp_c}
						СРЕДНЯЯ: {weather.forecast.forecastday[0].day.avgtemp_c}
						{weather.forecast.forecastday[0].day["daily_will_it_rain"] ===
							1 && (
							<span className={styles.rainOrSnowBlock}>
								<b>ОЖИДАЕТСЯ ДОЖДЬ</b> С ШАНСОМ{" "}
								<b>
									{weather.forecast.forecastday[0].day.daily_chance_of_rain}
								</b>
							</span>
						)}
						{weather.forecast.forecastday[0].day["daily_will_it_snow"] ===
							1 && (
							<span className={styles.rainOrSnowBlock}>
								<b>ОЖИДАЕТСЯ СНЕГ</b> С ШАНСОМ{" "}
								<b>
									{weather.forecast.forecastday[0].day.daily_chance_of_snow}
								</b>
							</span>
						)}
					</div>
					<div className={styles.windBlock}>
						ВЕТЕР <br />
						МАКСИМАЛЬНЫЙ: {weather.forecast.forecastday[0].day.maxwind_kph}{" "}
						КМ/ЧАС
					</div>
					<div className={styles.risesAndSetsBlock}>
						<div className={styles.sunRisesBlock}>
							СОНЦЕ <br />
							РАСВЕТ {weather.forecast.forecastday[0].astro.sunrise} <br />
							ЗАКАТ {weather.forecast.forecastday[0].astro.sunset} <br />
						</div>
						<div className={styles.moonRisesBlock}>
							<br />
							Луна <br />
							РАСВЕТ {weather.forecast.forecastday[0].astro.moonrise} <br />
							ЗАКАТ {weather.forecast.forecastday[0].astro.moonset} <br />
						</div>
					</div>
					<div className={styles.clothesTo}>
						ОДЕЖДУ ОДЕТЬ:{" "}
						{getClothes(
							weather.forecast.forecastday[0].day.avgtemp_c,
							weather.forecast.forecastday[0].day["daily_will_it_rain"] === 1,
							weather.forecast.forecastday[0].day["daily_will_it_snow"] === 1
						)?.map((obj) => (
							<p key={uid()}>
								{obj.name}{" "}
								{obj?.imageURL !== undefined && (
									<Image
										src={obj.imageURL}
										width={100}
										height={150}
										alt={obj.name}
									/>
								)}
							</p>
						))}
					</div>
					<div className={styles.weatherByHours}>
						По Часам
						<div className={styles.hours}>
							{getWeatherByHour(
								[0, 3, 6, 9, 12, 15, 18, 21],
								weather.forecast.forecastday[0].hour
							).map((hour) => {
								return (
									<div
										style={{ border: "1px solid black" }}
										key={uid()}
									>
										{hour.time.split(" ")[1]} <br />
										{hour.condition.text}
										<Image
											src={`https:${hour.condition.icon}`}
											width={48}
											height={48}
											quality={80}
											alt={hour.condition.text}
										/>
										<br />
										Температура: {hour.temp_c}°C
										<br />
										{hour.will_it_rain == 1 && (
											<span>
												<b>Дождь {hour.chance_of_rain}%</b>
												<br />
											</span>
										)}
										{hour.will_it_snow == 1 && (
											<span>
												Снег <b>{hour.chance_of_snow}</b>
												<br />
											</span>
										)}
										Влажность: <b>{hour.humidity}%</b> <br />
										ВЕТЕР: {hour.wind_kph} км/час
									</div>
								);
							})}
						</div>
					</div>
				</section>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}
