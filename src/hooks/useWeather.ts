import axios from 'axios'
import { z } from 'zod'
import { SearchType } from '../types'



//TYPE GUARD OR ASSERTION FUNCTION
/*function isWeatherResult(weather: unknown): weather is Weather{

    return (
        Boolean(weather) &&
        typeof weather === 'object' &&
        typeof (weather as Weather).name === 'string' &&
        typeof (weather as Weather).main === 'object' &&
        typeof (weather as Weather).main.temp === 'number' &&
        typeof (weather as Weather).main.temp_min === 'number' &&
        typeof (weather as Weather).main.temp_max === 'number'
    )
}*/

//ZOD SCHEMA

const WeatherSchema = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_min: z.number(),
        temp_max: z.number()
    })
})

type Weather = z.infer<typeof WeatherSchema>

export default function useWeather() {
    
    
    const fetchWeather = async (search: SearchType) => {

        const appId = import.meta.env.VITE_API_KEY


        try {

            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},~${search.country}&appid=${appId}`

            const {data} = await axios(geoUrl)//default get request
           
            const {lat, lon} = data[0]

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            const { data: weatherResult } = await axios(weatherUrl)

            const result = WeatherSchema.safeParse(weatherResult)
           
            if(result.success) {
                console.log(result.data.name, result.data.main.temp)
            }

            /*const result = isWeatherResult(weatherResult)

            if(result) {
                console.log(weatherResult.name, weatherResult.main.temp)
            }*/

        } catch (error) {
            console.log(error)
        }
    }

    return {
        fetchWeather
    }
}