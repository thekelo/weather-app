const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your API key
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weather-description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const weatherIcon = document.querySelector(".weather-icon i");

// Fetch weather data
async function getWeather(city) {
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod === "404") {
            alert("City not found!");
            return;
        }

        // Update UI
        cityName.textContent = data.name;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        humidity.textContent = `${data.main.humidity}%`;
        windSpeed.textContent = `${data.wind.speed} km/h`;

        // Update weather icon
        const iconCode = data.weather[0].icon;
        weatherIcon.className = getWeatherIcon(iconCode);

    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Error fetching weather data!");
    }
}

// Map OpenWeatherMap icons to Font Awesome
function getWeatherIcon(iconCode) {
    const iconMap = {
        "01d": "fas fa-sun",         // Clear sky (day)
        "01n": "fas fa-moon",        // Clear sky (night)
        "02d": "fas fa-cloud-sun",   // Few clouds (day)
        "02n": "fas fa-cloud-moon",  // Few clouds (night)
        "03d": "fas fa-cloud",       // Scattered clouds
        "03n": "fas fa-cloud",
        "04d": "fas fa-cloud",       // Broken clouds
        "04n": "fas fa-cloud",
        "09d": "fas fa-cloud-rain",  // Shower rain
        "09n": "fas fa-cloud-rain",
        "10d": "fas fa-cloud-sun-rain", // Rain (day)
        "10n": "fas fa-cloud-moon-rain",// Rain (night)
        "11d": "fas fa-bolt",        // Thunderstorm
        "11n": "fas fa-bolt",
        "13d": "fas fa-snowflake",   // Snow
        "13n": "fas fa-snowflake",
        "50d": "fas fa-smog",       // Mist
        "50n": "fas fa-smog"
    };
    return iconMap[iconCode] || "fas fa-cloud";
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) getWeather(city);
    }
});

// Load default city (optional)
getWeather("London");
