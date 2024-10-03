const cityInput = document.querySelector(".input-city");
const searchBtn = document.querySelector(".search-btn");

const apiKey = "34cfc60860c65187b56b96404e048411";

const notFoundMessage = document.querySelector(".not-found-message");
const searchMessage = document.querySelector(".search-message");
const weatherInfor = document.querySelector(".weather-infor");

// valid input section
searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != " ") {
    updateWeather(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && cityInput.value.trim() != "") {
    updateWeather(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

// fectch data, call api
async function getFectchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

  const respond = await fetch(apiUrl);

  return respond.json();
}

// display sections for each case
function showDisplaySection(section) {
  [notFoundMessage, searchMessage, weatherInfor].forEach(
    (section) => (section.style.display = "none")
  );

  section.style.display = "block";
}

async function updateWeather(city) {
  const weatherData = await getFectchData("weather", city);

  if (weatherData.cod != 200) {
    showDisplaySection(notFoundMessage);
  }

  showDisplaySection(weatherInfor);
}
