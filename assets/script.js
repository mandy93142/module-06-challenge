const apiKey = '81a76875264a0bb50441c5cf432a4f65'; 
const cityListEl = document.getElementById('city-list');
const cityInputEl = document.getElementById('city-input');
const searchButtonEl = document.getElementById('search-button');
const currentWeatherEl = document.getElementById('current-weather');
const forecastContainerEl = document.getElementById('forecast-container');
const cities = ['Atlanta', 'Denver', 'Seattle', 'San Francisco', 'Orlando', 'New York', 'Chicago', 'Austin'];

// Initialize the dashboard with the predefined cities
function initDashboard() {
    cities.forEach(city => {
        const cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.onclick = function () {
            fetchWeatherData(city);
        };
        cityListEl.appendChild(cityButton);
    });
}

// Fetch weather data from the API
function fetchWeatherData(city) {
    const geocodeUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    fetch(geocodeUrl).then(response => {
        if (response.ok) {
            response.json().then(data => {
                const { lat, lon } = data.coord;
                fetchForecast(lat, lon, city);
            });
        } else {
            console.error('City not found');
        }
    });
}

// Fetch forecast data using coordinates
function fetchForecast(lat, lon, city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    fetch(forecastUrl).then(response => {
        if (response.ok) {
            response.json().then(data => {
                displayWeatherData(data, city);
            });
        } else {
            console.error('Forecast not found');
        }
    });
}

// Display the weather data on the dashboard
function displayCurrentWeather(data, city) {
    const weather = data.list[0];
    const weatherIconUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;

    currentWeatherEl.innerHTML = `
        <h2>${city} (${new Date().toLocaleDateString()})</h2>
        <img src="${weatherIconUrl}" alt="${weather.weather[0].description}" />
        <p>Temp: ${weather.main.temp}°F</p>
        <p>Wind: ${weather.wind.speed} MPH</p>
        <p>Humidity: ${weather.main.humidity}%</p>
    `;
}

// Display the 5-day forecast data
function displayForecast(data) {
    forecastContainerEl.innerHTML = '<h2>5-Day Forecast:</h2>';

    const dailyForecasts = data.list.filter((forecast, index) => index % 8 === 0);

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        const weatherIconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

        const forecastEl = document.createElement('div');
        forecastEl.className = 'forecast-day';
        forecastEl.innerHTML = `
            <h3>${date}</h3>
            <img src="${weatherIconUrl}" alt="${forecast.weather[0].description}" />
            <p>Temp: ${forecast.main.temp}°F</p>
            <p>Wind: ${forecast.wind.speed} MPH</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
        `;
        forecastContainerEl.appendChild(forecastEl);
    });
}

// Display the weather data on the dashboard
function displayWeatherData(data, city) {
    displayCurrentWeather(data, city);
    displayForecast(data);
}

// Add Event listeners
searchButtonEl.onclick = function () {
    const city = cityInputEl.value.trim();
    fetchWeatherData(city);
};

// Initialize the dashboard on page load
initDashboard();
