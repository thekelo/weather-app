const API_KEY = "870addca104e2dca51c0a4800b2dbe5f";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

async function getWeather(city) {
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
        const data = await response.json();
        
        console.log(data); // Debug: Check API response

        if (data.cod === 401) {
            alert("API Key invalid. Verify your OpenWeatherMap account.");
            return;
        }
        if (data.cod === "404") {
            alert("City not found. Try: London, New York, Tokyo");
            return;
        }

        // Update UI
        document.getElementById("city-name").textContent = data.name;
        document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById("weather-description").textContent = data.weather[0].description;
        document.getElementById("humidity").textContent = `${data.main.humidity}%`;
        document.getElementById("wind-speed").textContent = `${data.wind.speed} km/h`;
        
        // Set icon
        const iconCode = data.weather[0].icon;
        document.querySelector(".weather-icon i").className = getWeatherIcon(iconCode);

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to fetch weather. Check console.");
    }
}

// (Keep the rest of your code: getWeatherIcon(), event listeners, etc.)
