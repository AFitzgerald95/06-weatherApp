// API Elements
const apiKey = '332f3501fcaba0b14a6a6b60060dfea9';

// DOM Elements
let searchBtn = $('#searchBtn');
let weatherDisplay = $('#weatherDisplay')
let forecastDisplay = $('#forecastDisplay')
let locationInput = $('#location')

// Event listener for the form submission
$('form').submit(function (event) {
    event.preventDefault();
    // Get the user-entered location
    const userLocation = locationInput.val();

    // Calls the function to fetch weather data
    getWeatherData(userLocation);

    // Updates the recent searches
    updateRecentSearches(userLocation);
});

function getWeatherData(location) {
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`

    // Fetch current weather data
    fetch(currentWeatherURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Function to update the current weather UI
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
            // Function to update the 5-day forecast UI
            updateForecastUI(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

// Function to convert Celsius to Fahrenheit
function convertCelsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}


// Function to convert Kelvin to Celsius
function kelvinToCelsius(kelvin) {
        return kelvin - 273.15;
}

// Function to update the UI with current weather data
function updateCurrentWeatherUI(data) {
    console.log('Weather Data:', data);

    // Updates the weatherDisplay with the relevant data
    const kelvinTemp = data.main.temp;
    const celsiusTemp = Math.round(kelvinToCelsius(kelvinTemp));

    // Adds a check to ensure temperature values are reasonable
    if (celsiusTemp > -100 && celsiusTemp < 100) {
        const fahrenheitTemp = convertCelsiusToFahrenheit(celsiusTemp);


        // Updates with information about the current city
        $('#currentCityName').text(data.name);
        $('#currentDate').text(dayjs().format('MMMM D, YYYY'));
        $('#weatherIcon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
        $('#currentTemperature').html(`Temperature: ${fahrenheitTemp}&deg;F (${celsiusTemp}&deg;C)`);
        $('#currentHumidity').text(`Humidity: ${data.main.humidity}%`);
        $('#currentWindSpeed').text(`Wind Speed: ${data.wind.speed} m/s`);
    } else {
        console.error('Invalid temperature value:', celsiusTemp);
    }
}

// Function to update the UI with 5-day forecast data
function updateForecastUI(data) {
    // Clears previous forecast data
    forecastDisplay.empty();

    // Loops through forecast data
    for (let i = 0; i < data.list.length; i += 8) {
        const forecastItem = data.list[i];

        // Extracts relevant information
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

        // Create HTML elements for forecast item
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

        // Appends the forecast item to the forecastDisplay container
        forecastDisplay.append(forecastItemHTML);
        }
    }

// Function to update the UI with recent searches
function updateRecentSearches(city) {
    // Gets the existing searches from localStorage or creates an empty array
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    // Adds the new city to the recent searches
    recentSearches.unshift(city);

    // if statement that only keeps the 5 most recent searches
    if (recentSearches.length > 5) {
        recentSearches.pop();
    }

    // Saves the updated recent searches to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));

    // Updates the DOM with the recent searches
    const recentSearchesList = $('#recentSearches');
    recentSearchesList.empty();
    recentSearches.forEach(search => {
        const listItem = $('<li>').text(search);

        // Adds a click event listener to each list item
        listItem.click(function() {
            // Sets the selected city in the search bar
            locationInput.val(search);
            
            // Triggers the form submission (simulates a user clicking the search button)
            $('form').submit();
        });

        recentSearchesList.append(listItem);
    });
}
 
