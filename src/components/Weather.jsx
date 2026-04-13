import React, { useRef, useState, useEffect } from 'react'
import './Weather.css'
import searchIcon from '../assets/search-icon.png'
import sunAndcloudIcon from '../assets/SunAndCloud.png'
import rainIcon from '../assets/rain.png'
import drizzleIcon from '../assets/drizzle.png'
import snowIcon from '../assets/snow.png'
import sunIcon from '../assets/sun.png'
import humidityIcon from '../assets/humidity.png'
import windIcon from '../assets/wind.jpg'

const getAQI = (index) => {
    const levels = {
        1: { label: "Good", color: "#22c55e" },
        2: { label: "Moderate", color: "#eab308" },
        3: { label: "Sensitive", color: "#f97316" },
        4: { label: "Unhealthy", color: "#ef4444" },
        5: { label: "Very Unhealthy", color: "#a855f7" },
        6: { label: "Hazardous", color: "#7f1d1d" },
    }
    return levels[index] || { label: "Unknown", color: "#888" };
}

// add this above your component (alongside getAQI)
const getWeatherIcon = (code) => {
    if (code === 1000) return sunIcon                    // Sunny / Clear
    if (code === 1003) return sunAndcloudIcon            // Partly Cloudy
    if ([1006, 1009].includes(code)) return sunAndcloudIcon  // Cloudy / Overcast
    if ([1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195].includes(code)) return rainIcon  // Rain
    if ([1063, 1072, 1198, 1201, 1240, 1243, 1246].includes(code)) return drizzleIcon  // Drizzle
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return snowIcon  // Snow
    return sunIcon  // fallback
}

const Weather = () => {

    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null); // null is better than false

    const search = async (city) => {
        if (!city) return; // guard empty input
        try {
            const url = `https://api.weatherapi.com/v1/current.json?key=b456f78632f042c9bba115520261304&q=${city}&aqi=yes`
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            if (data.error) {
                alert(data.error.message);
                return;
            }
            setWeatherData(data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    useEffect(() => {
        search('Mumbai');
    }, [])

    // AQI values
    const aqiIndex = weatherData?.current?.air_quality?.["us-epa-index"];
    const { label: aqiLabel, color: aqiColor } = aqiIndex ? getAQI(aqiIndex) : { label: "--", color: "#888" };

    return (
        <div>
            <div className="weather">
                <div className="search-bar">
                    <input type="text" placeholder="Search" ref={inputRef} />
                    <img
                        src={searchIcon}
                        alt="Search"
                        onClick={() => search(inputRef.current.value)}
                    />
                </div>

                <img
                    src={getWeatherIcon(weatherData?.current?.condition?.code)}
                    alt='weather icon'
                    className='weather-icon'
                />

                <p className='temperature'>{weatherData?.current?.temp_c ?? '--'} °C</p>
                <p className='Location'>{weatherData?.location?.name ?? '--'}</p>

                <div
                    className="aqi-badge"
                    style={{ backgroundColor: aqiColor }}
                >
                    Air Quality — {aqiLabel}
                </div>

                <div className="weather-data">
                    <div className="col">
                        <img src={humidityIcon} alt='Humidity' />
                        <div>
                            <p>{weatherData?.current?.humidity ?? '--'} %</p>
                            <span>Humidity</span>
                        </div>
                    </div>
                    <div className="col">
                        <img src={windIcon} alt='Wind' />
                        <div>
                            <p>{weatherData?.current?.wind_kph ?? '--'} km/h</p>
                            <span>Wind Speed</span>
                        </div>
                    </div>

                </div>
                &nbsp;
                <p className='last-updated'>Updated: {weatherData?.current?.last_updated}</p>
            </div>
        </div>
    )
}

export default Weather