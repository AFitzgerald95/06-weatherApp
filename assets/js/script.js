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
            // Call a function to update the current weather UI
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
            // Call a function to update the 5-day forecast UI
            updateForecastUI(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

// Function to update the UI with current weather data
function updateCurrentWeatherUI(data) {
    // Updates the weatherDisplay with the relevant data
    weatherDisplay.html(`Temperature: ${data.main.temp}&deg;C, Description: ${data.weather[0].description}`);
}

// Function to update the UI with 5-day forecast data
function updateForecastUI(data) {
    // Clears previous forecast data
    forecastDisplay.empty();

    // Loops through forecast data
    for (let i = 0; i < data.list.length; i += 8) {
        const forecastItem = data.list[i];

        // Extract relevant information
        const date = forecastItem.dt_txt;
        const temperature = forecastItem.main.temp;
        const description = forecastItem.weather[0].desccription;

        // Create HTML elements for forecast item
        const forecastItemHTML = `
            <li>
                <strong>Date:</strong> ${date} |
                <strong>Temperature:</strong> ${temperature}&deg;C |
                <strong>Description:</strong> ${description}
            </li>
        `;

        // Appends the forecast item to the forecastDisplay container
        forecastDisplay.append(forecastItemHTML);
    }
}

