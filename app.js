const nameButton = document.querySelector(".city-name-button");
const geolocationButton = document.querySelector(".geolocation-button");
const displayError = document.querySelector(".display-error");
const displayDate = document.querySelector(".display-date");
const displaySection = document.querySelector(".display-section");

const API_KEY = "dd1cd76f3bbbb7204b9e9286b0ba60e8";

const date = new Date();
displayDate.textContent = date.toLocaleDateString();

const getWeatherByPosition = async (lon, lat) => {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  let res = await fetch(url);
  let data = await res.json();

  displayWeather(data);
};

const getWeatherBycityName = async (cityName) => {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
  let res = await fetch(url);
  let data = await res.json();

  function error() {
    clearDisplay();
    displayError.textContent = "Please enter a city name to search";
  }

  if (data.cod !== 200) {
    return error();
  } else {
    displayWeather(data);
  }
};

const clearDisplay = () => {
  displayError.textContent = "";
  let child = displaySection.lastElementChild;
  while (child) {
    displaySection.removeChild(child);
    child = displaySection.lastElementChild;
  }
};

const displayWeather = (data) => {
  clearDisplay();

  let { temp, pressure, humidity } = data.main;
  let { description, icon } = data.weather[0];
  let { speed } = data.wind;
  let { country } = data.sys;
  let { name } = data;
  let fahrenheit = (temp * 9) / 5 + 32;

  let weatherEl = document.createElement("div");
  weatherEl.innerHTML = `
	  	<div class="city-name">Weather in ${name}, ${country}</div>
        <div class="temperature-section">
            <div class="degree"><span class="degree-temp">${temp}</span><span class="degree-span">C</span></div>
            <div class="description">
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
                <p class="description-text">${description}</p>
            </div>
        </div>
        <div class="details-section">
            <div class="details">
                <div class="details-text">pressure</div>
                <div class="details-result">${pressure}</div>
            </div>
            <div class="details">
                <div class="details-text">humidity</div>
                <div class="details-result">${humidity}</div>
            </div>
            <div class="details">
                <div class="details-text">wind speed</div>
                <div class="details-result">${speed}</div>
            </div>
        </div>
  `;
  displaySection.appendChild(weatherEl);

  // Change degree between celsius and fahrenheit
  let degree = document.querySelector(".degree");
  let degreeTemp = document.querySelector(".degree-temp");
  let degreeSpan = document.querySelector(".degree-span");

  degree.addEventListener("click", () => {
    if (degreeSpan.textContent === "C") {
      degreeSpan.textContent = "F";
      degreeTemp.textContent = Math.floor(fahrenheit);
    } else {
      degreeSpan.textContent = "C";
      degreeTemp.textContent = temp;
    }
  });
};

// Event listeners
// Get city name
nameButton.addEventListener("click", (e) => {
  e.preventDefault();
  let cityName = document.querySelector(".city-name-input").value;
  document.querySelector(".city-name-input").value = "";
  getWeatherBycityName(cityName);
});
// Get geolocation
geolocationButton.addEventListener("click", () => {
  function success(position) {
    let lon = position.coords.longitude;
    let lat = position.coords.latitude;
    getWeatherByPosition(lon, lat);
  }

  function error() {
    clearDisplay();
    displayError.textContent = "Geolocation is disabled on this device";
  }

  navigator.geolocation.getCurrentPosition(success, error, {
    maximumAge: 10000,
    timeout: 5000,
    enableHighAccuracy: true,
  });
});
