const API_KEY = "870addca104e2dca51c0a4800b2dbe5f";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEOCODE_URL = "http://api.openweathermap.org/geo/1.0/direct";

// DOM Elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const themeToggle = document.getElementById("theme-toggle");
const forecastContainer = document.getElementById("forecast-container");
const historyList = document.getElementById("history-list");

// State
let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadHistory();
    getWeather("London"); // Default city
});

// Fetch current weather
async function getWeather(city) {
    try {
        // Get coordinates first for more accurate results
        const geoResponse = await fetch(`${GEOCODE_URL}?q=${city}&limit=1&appid=${API_KEY}`);
        const geoData = await geoResponse.json();
        
        if (!geoData.length) {
            alert("City not found!");
            return;
        }

        const { lat, lon } = geoData[0];
        
        // Fetch current weather
        const weatherResponse = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const weatherData = await weatherResponse.json();

        // Fetch 5-day forecast
        const forecastResponse = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const forecastData = await forecastResponse.json();

        updateCurrentWeather(weatherData);
        updateForecast(forecastData);
        addToHistory(city);
        
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to fetch weather data");
    }
}

// Update current weather UI
function updateCurrentWeather(data) {
    document.getElementById("city-name").textContent = data.name;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("weather-description").textContent = data.weather[0].description;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind-speed").textContent = `${data.wind.speed} km/h`;
    
    const iconCode = data.weather[0].icon;
    document.querySelector(".weather-icon i").className = getWeatherIcon(iconCode);
}

// Update 5-day forecast
function updateForecast(data) {
    forecastContainer.innerHTML = "";
    
    // Filter for one forecast per day (API returns every 3 hours)
    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);
    
    dailyForecasts.slice(0, 5).forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en", { weekday: "short" });
        
        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <p><strong>${dayName}</strong></p>
            <i class="${getWeatherIcon(day.weather[0].icon)}"></i>
            <p>${Math.round(day.main.temp)}°C</p>
        `;
        forecastContainer.appendChild(card);
    });
}

// Geolocation
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchCityName(latitude, longitude);
            },
            error => {
                alert("Geolocation failed: " + error.message);
            }
        );
    } else {
        alert("Geolocation is not supported by your browser");
    }
});

async function fetchCityName(lat, lon) {
    try {
        const response = await fetch(`${GEOCODE_URL}?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
        const data = await response.json();
        if (data.length) {
            getWeather(data[0].name);
        }
    } catch (error) {
        console.error("Error fetching city:", error);
    }
}

// Search History
function addToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.unshift(city);
        if (searchHistory.length > 5) searchHistory.pop();
        localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
        loadHistory();
    }
}

function loadHistory() {
    historyList.innerHTML = "";
    searchHistory.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.addEventListener("click", () => getWeather(city));
        historyList.appendChild(li);
    });
}

// Theme Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const icon = themeToggle.querySelector("i");
    icon.className = document.body.classList.contains("dark-theme") 
        ? "fas fa-sun" 
        : "fas fa-moon";
});

// Weather Icon Mapping (keep existing)
function getWeatherIcon(iconCode) {
    const iconMap = {
        "01d": "fas fa-sun",
        "01n": "fas fa-moon",
        // ... (keep previous icon mappings)
    };
    return iconMap[iconCode] || "fas fa-cloud";
}

// Event Listeners (keep existing search functionality)
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
