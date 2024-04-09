import { useMemo, useState } from 'react'
import axios from 'axios'
import { set, z } from 'zod'
import { SearchType } from '../types'


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

const initialState = {
    name: '',
    main: {
        temp: 0,
        temp_min: 0,
        temp_max: 0
    }
}


export default function useWeather() {

    const [weather, setWeather] = useState<Weather>(initialState)

    const [loading, setLoading] = useState(false)

    const [notFound, setNotFound] = useState(false)
    
    
    const fetchWeather = async (search: SearchType) => {

        const appId = import.meta.env.VITE_API_KEY

        setLoading(true)
        setWeather(initialState)
        try {

            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},~${search.country}&appid=${appId}`

            const {data} = await axios(geoUrl)//default get request
           
            console.log(data)

            //check if data is exist

            if(!data[0]) {
                setNotFound(true)
                return
            }

            const {lat, lon} = data[0]

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            const { data: weatherResult } = await axios(weatherUrl)



            //ZOD
            const result = WeatherSchema.safeParse(weatherResult)
           
            if(result.success) {
                setWeather(result.data)
            }


        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    const hasWeatherData = useMemo(() => weather.name, [weather])


    return {
        weather,
        loading,
        notFound,
        fetchWeather,
        hasWeatherData
    }
}