import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;

// OpenCage and OpenWeatherMap API keys and endpoint URLs
const openweathermapAPI = process.env.OPENWEATHERMAP_API_KEY;
const opencageApiKey = process.env.OPENCAGE_API_KEY;
const opencageEndpoint = 'https://api.opencagedata.com/geocode/v1/json';
const openweathermapWeatherEndpoint = 'http://api.openweathermap.org/data/2.5/weather';
const openweathermapForecastEndpoint = 'http://api.openweathermap.org/data/2.5/forecast';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/', async (req, res) => {
    const city = req.body.city;

    try {
        const { countryCode, country, state } = await getGeolocation(city);
        const currentWeather = await getCurrentWeather(city, countryCode);
        const weatherForecast = await getForecast(city, countryCode);

        // Construct the weather icon URL for the current weather
        currentWeather.iconUrl = getWeatherIconUrl(currentWeather.icon);

        res.render('index.ejs', { 
            city, 
            countryCode, 
            country, 
            state, 
            currentWeather, 
            weatherForecast,
            getWeatherIconUrl
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





async function getGeolocation(city) {
    const opencageParams = {
        params: {
            q: city,
            key: opencageApiKey,
        },
    };
    try {
        const response = await axios.get(opencageEndpoint, opencageParams);
        const results = response.data.results;

        if (results.length > 0) {
            const components = results[0].components;
            const countryCode = components.country_code;
            const country = components.country;
            const state = components.state || ''; // Some countries don't have states

            console.log(`City: ${city}`);
            console.log(`Country Code: ${countryCode}`);
            console.log(`Country: ${country}`);
            console.log(`State: ${state}`);

            return { countryCode, country, state };
        } else {
            throw new Error(`No results found for ${city}`);
        }
    } catch (error) {
        console.error('Error fetching geolocation:', error.message);
        throw error;
    }
}

// Function to get current weather
async function getCurrentWeather(city, countryCode) {
    const weatherEndpoint = `${openweathermapWeatherEndpoint}?q=${city},${countryCode}&appid=${openweathermapAPI}`;
    

    try {
        const response = await axios.get(weatherEndpoint);
        const currentWeatherData = response.data;
        const currentWeatherTime = new Date();
       
        // Format date and time for current weather
        const formattedCurrentTime = currentWeatherTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const formattedCurrentDate = currentWeatherTime.toLocaleString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

        console.log("Current Weather:");
        console.log(`Time: ${formattedCurrentTime}`);
        console.log(`Date: ${formattedCurrentDate}`);
        console.log(`Weather: ${currentWeatherData.weather[0].description}`);
        console.log(`Temperature: ${currentWeatherData.main.temp} °C`);
        console.log(`icon: ${currentWeatherData.weather[0].icon}`)
        console.log("------");

        


        return {
            time: formattedCurrentTime,
            date: formattedCurrentDate,
            weather: currentWeatherData.weather[0].description,
            temperature: currentWeatherData.main.temp,
            icon: currentWeatherData.weather[0].icon,
        };
    } catch (error) {
        console.error("Error fetching current weather:", error.message);
        throw error;
    }
}


// Function to get forecast
async function getForecast(city, countryCode) {
    const forecastEndpoint = `${openweathermapForecastEndpoint}?q=${city},${countryCode}&appid=${openweathermapAPI}`;

    try {
        const response = await axios.get(forecastEndpoint);
        const forecastData = response.data;

        // Extract consecutive 3-hour forecasts for the next 6 intervals
        const forecasts = [];

        for (let i = 0; i < 6; i++) {
            const entry = forecastData.list[i];
            const forecastTime = new Date(entry.dt * 1000);

            // Format date and time
            const formattedTime = forecastTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            const formattedDate = forecastTime.toLocaleString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

            entry.icon = entry.weather[0].icon;

            // Add relevant information to the array
            forecasts.push({
                time: formattedTime,
                date: formattedDate,
                weather: entry.weather[0].description,
                temperature: entry.main.temp,
                icon: entry.icon
            });
        }

        console.log("Forecast Data:", forecasts);
        return forecasts;
    } catch (error) {
        console.error("Error fetching forecast:", error.message);
        throw error;
    }
}

function getWeatherIconUrl(iconCode) {
    // Construct the URL for the weather icon
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
}


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
