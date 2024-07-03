const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    getWeatherByCity(city);
});

function getWeatherByCity(city) {
    fetch(`${apiUrl}weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            getForecast(data.coord.lat, data.coord.lon);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function getForecast(lat, lon) {
    fetch(`${apiUrl}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast data:', error));
}

function displayWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('forecast-day');
        dayDiv.innerHTML = `
            <h4>${new Date(day.dt_txt).toLocaleDateString()}</h4>
            <p>${day.weather[0].description}</p>
            <p>Temp: ${day.main.temp}°C</p>
        `;
        forecastContainer.appendChild(dayDiv);
    }
}

navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    fetch(`${apiUrl}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            getForecast(latitude, longitude);
        })
        .catch(error => console.error('Error fetching geolocation weather data:', error));
});
