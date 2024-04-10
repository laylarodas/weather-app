import { Weather } from "../../hooks/useWeather"
import { formatTemperature } from "../../helpers"
import styles from './WeatherDetail.module.css'

type WeatherDetailProps = {
  weather: Weather
}



export const WeatherDetail = ({ weather }: WeatherDetailProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.divIcon}>
        <h2>{weather.name} </h2>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="icon" />
      </div>
      <p className={styles.current}>{formatTemperature(weather.main.temp)} &deg;C</p>
      <p className={styles.description}>{weather.weather[0].description}</p>
      <div className={styles.temperatures}>
        <p>Min: <span>{formatTemperature(weather.main.temp_min)} &deg;C</span></p>
        <p>Max: <span> {formatTemperature(weather.main.temp_max)} &deg;C</span></p>
      </div>

    </div>
  )
}
