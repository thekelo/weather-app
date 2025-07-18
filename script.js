const API_KEY = "870addca104e2dca51c0a4800b2dbe5f";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEOCODE_URL = "https://api.openweathermap.org/geo/1.0/direct";

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
window.onload = function() {
    loadHistory();
    getWeather("London"); // Default city
};

// Fetch current weather
async function getWeather(city) {
    try {
        // Show loading state
        document.getElementById("city-name").textContent = "Loading...";
        
        // Get coordinates
        const geoResponse = await fetch(`${GEOCODE_URL}?q=${city}&limit=1&appid=${API_KEY}`);
        if (!geoResponse.ok) {
            throw new Error(`Geocoding failed: ${geoResponse.status}`);
        }
        const geoData = await geoResponse.json();
        
        if (!geoData.length) {
            alert("City not found! Please try another location.");
            return;
        }

        const { lat, lon } = geoData[0];
        
        // Fetch current weather and forecast in parallel
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
            fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        ]);

        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error(`API request failed: ${weatherResponse.status} or ${forecastResponse.status}`);
        }

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        updateCurrentWeather(weatherData);
        updateForecast(forecastData);
        addToHistory(city);
        
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("city-name").textContent = "Error";
        alert(`Failed to get weather data: ${error.message}`);
    }
}

// [Rest of your existing functions remain the same...]
// updateCurrentWeather, updateForecast, fetchCityName, 
// addToHistory, loadHistory, getWeatherIcon functions
// Event listeners
