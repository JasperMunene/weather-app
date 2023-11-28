// Get the input element
var searchInput = document.getElementById("searchInput");

// Add an event listener for the "keydown" event
searchInput.addEventListener("keydown", function (event) {
    // Check if the pressed key is Enter (key code 13)
    if (event.keyCode === 13) {
        // Call your search function here
        search();
    }
});

// Your search function
function search() {
    // Get the value from the input field
    var searchTerm = searchInput.value;

    // Perform the search operation with the searchTerm
    console.log("Searching for: " + searchTerm);

    // Add your search logic here
    // You can make an AJAX request, update the DOM, etc.
}

// Function to get the current date and time
function getCurrentDateTime() {
    var now = new Date();
    var formattedDateTime = now.toLocaleString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    return formattedDateTime;
}

// Function to handle form submission
function handleFormSubmission() {
    // Get the input value
    var cityInput = document.getElementById('searchInput');
    var cityName = cityInput.value;

    // If the input value is the current date and time, clear it
    if (cityName === getCurrentDateTime()) {
        cityInput.value = '';
    }
}


// Function to update default date and time
function updateDefaultDateTime() {
    const defaultDateElement = document.getElementById('default-date');
    const defaultTimeElement = document.getElementById('default-time');

    const now = new Date();
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

    defaultDateElement.textContent = now.toLocaleString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    defaultTimeElement.textContent = now.toLocaleString('en-US', timeOptions);
}

// Call the function to update default date and time when the page loads
window.addEventListener('load', updateDefaultDateTime);

function toggleTemperatureUnit() {
    // Get the temperature display element
    let tempDisplay = document.getElementById('temp-display');

    // Get the current temperature unit from the data attribute
    let currentTempUnit = document.querySelector('.current-weather').getAttribute('data-temp-unit');

    // Get the current temperature value
    let currentTemperature = parseFloat(tempDisplay.innerText);

    // Convert temperature units and update the display
    if (currentTempUnit === 'celsius') {
        // Convert to Fahrenheit
        let fahrenheitTemperature = (currentTemperature * 9 / 5) + 32;
        tempDisplay.innerText = fahrenheitTemperature.toFixed(2);
        document.getElementById('temp-unit').innerText = " Fahrenheit | Convert to Celsius";
        document.querySelector('.current-weather').setAttribute('data-temp-unit', 'fahrenheit');
    } else {
        // Convert to Celsius
        let celsiusTemperature = (currentTemperature - 32) * 5 / 9;
        tempDisplay.innerText = celsiusTemperature.toFixed(2);
        document.getElementById('temp-unit').innerText = " Celsius | Convert to Fahrenheit";
        document.querySelector('.current-weather').setAttribute('data-temp-unit', 'celsius');
    }
}



let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("activity");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}



