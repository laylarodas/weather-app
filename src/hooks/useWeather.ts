import { useMemo, useState } from 'react'
import axios from 'axios'
import { z } from 'zod'
import { SearchType } from '../types'
//import { object, string, number, Output, parse } from 'valibot'


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

export type Weather = z.infer<typeof WeatherSchema>


//VALIBOT SCHEMA
/*const WeatherSchema = object({
    name: string(),
    main: object({
        temp: number(),
        temp_min: number(),
        temp_max: number()
    })
})

type Weather = Output<typeof WeatherSchema>*/

export default function useWeather() {

    const [weather, setWeather] = useState<Weather>({
        name: '',
        main: {
            temp: 0,
            temp_min: 0,
            temp_max: 0
        }
    
    })
    
    
    const fetchWeather = async (search: SearchType) => {

        const appId = import.meta.env.VITE_API_KEY


        try {

            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},~${search.country}&appid=${appId}`

            const {data} = await axios(geoUrl)//default get request
           
            const {lat, lon} = data[0]

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            const { data: weatherResult } = await axios(weatherUrl)

            //VALIBOT
            //const result = parse(WeatherSchema, weatherResult)
            //console.log(result)


            //ZOD
            const result = WeatherSchema.safeParse(weatherResult)
           
            if(result.success) {
                setWeather(result.data)
            }

            //TYPE GUARD
            /*const result = isWeatherResult(weatherResult)

            if(result) {
                console.log(weatherResult.name, weatherResult.main.temp)
            }*/

        } catch (error) {
            console.log(error)
        }
    }


    const hasWeatherData = useMemo(() => weather.name, [weather])


    return {
        weather,
        fetchWeather,
        hasWeatherData
    }
}