// API Key
const apiKey = '332f3501fcaba0b14a6a6b60060dfea9';

// Variables
let searchBtn = $('#searchBtn');
let mainContent = $('main');
let weatherDisplay = $('#weatherDisplay')
let forecastDisplay = $('#forecastDisplay')
let locationInput = $('#location')

// Runs functions that pull the weather data for the location entered by the user from the Api and updates the recent search history when the submit button is clicked.
$('form').submit(function (event) {
    event.preventDefault();
    const userLocation = locationInput.val();

    getWeatherData(userLocation);

    updateRecentSearches(userLocation);
});

// Displays the main area once the search button is clicked
searchBtn.click(function(){
    mainContent.css('display', 'block');
});

// Pulls the 5 day forecast and current weather data based on the location given by the user.
function getWeatherData(location) {
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`

    fetch(currentWeatherURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateCurrentWeatherUI(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
        });

    fetch(forecastURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateForecastUI(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

// Converts Celsius to fahrenheit
function convertCelsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Converts Kelvin to Celsius
function kelvinToCelsius(kelvin) {
        return kelvin - 273.15;
}

// Updates the current weather for the city given by the user
function updateCurrentWeatherUI(data) {
    console.log('Weather Data:', data);

    $('#weatherIcon').show();

    const kelvinTemp = data.main.temp;
    const celsiusTemp = Math.round(kelvinToCelsius(kelvinTemp));
    const fahrenheitTemp = Math.round(convertCelsiusToFahrenheit(celsiusTemp));

        $('#currentCityName').text(data.name);
        $('#currentDate').text(dayjs().format('MMMM D, YYYY'));
        $('#currentDescription').text(`${data.weather[0].description}`);
        $('#weatherIcon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
        $('#currentTemperature').html(`Temperature: ${fahrenheitTemp}&deg;F (${celsiusTemp}&deg;C)`);
        $('#currentHumidity').text(`Humidity: ${data.main.humidity}%`);
        $('#currentWindSpeed').text(`Wind Speed: ${data.wind.speed} m/s`);
 
}

// Updates the 5 day forecast for the city given by the user
function updateForecastUI(data) {
    forecastDisplay.empty();

    for (let i = 0; i < data.list.length; i += 8) {
        const forecastItem = data.list[i];

        const timestamp = forecastItem.dt * 1000;
        const date = dayjs(timestamp).format('dddd, MMM D');
        
        const kelvinTemp = forecastItem.main.temp;
        const celsiusTemp = Math.round(kelvinToCelsius(kelvinTemp));
        const fahrenheitTemp = Math.round(convertCelsiusToFahrenheit(celsiusTemp));
        const description = forecastItem.weather[0].description;
        const humidity = forecastItem.main.humidity;
        const windSpeed = forecastItem.wind.speed;
        const iconCode = forecastItem.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const forecastItemHTML = `
            <li>
                <strong>Date:</strong> ${date} |
                <img src="${iconUrl}" alt="Weather Icon"> |
                <strong>Temperature:</strong> ${fahrenheitTemp}&deg;F (${celsiusTemp}&deg;C) |
                <strong>Humidity:</strong> ${humidity}% |
                <strong>Wind Speed:</strong> ${windSpeed} m/s |
                <strong>Description:</strong> ${description}
            </li>
        `;

        forecastDisplay.append(forecastItemHTML);
        }
    }

// Updates the recent searches for different cities
function updateRecentSearches(city) {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    recentSearches.unshift(city);

    if (recentSearches.length > 5) {
        recentSearches.pop();
    }

    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));

    const recentSearchesList = $('#recentSearches');
    const searchHistoryTitle = $('#searchHistoryTitle');

    if (recentSearches.length > 0) {
        searchHistoryTitle.show();
    } else {
        searchHistoryTitle.hide();
    }

    recentSearchesList.empty();
    recentSearches.forEach(search => {
        const listItem = $('<li>').text(search);

        listItem.click(function() {
            locationInput.val(search);
            $('form').submit();
        });

        recentSearchesList.append(listItem);
    });
}