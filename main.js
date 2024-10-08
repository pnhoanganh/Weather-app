const cityInput = document.querySelector(".input-city");
const searchBtn = document.querySelector(".search-btn");

//change city name, temp,...
const cityName = document.querySelector('.city-name')
const temp = document.querySelector('.temp')
const conditional = document.querySelector('.conditional')
const windSpeedValue = document.querySelector('.wind-speed-value')
const humidityValue = document.querySelector('.humidity-value')
const currentDate = document.querySelector('.current-date')
const weatherSummaryImg = document.querySelector('.weatherSumImg')

const forecastContainer = document.querySelector('.forecast-container'); // Thêm phần tử chứa dự báo

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

function getWheatherIcon(id){
  if (id <= 232) return 'thunderstorm.svg'
  if (id <= 321) return 'drizzle.svg'
  if (id <= 531) return 'rain.svg'
  if (id <= 622) return 'snow.svg'
  if (id <= 781) return 'atmosphere.svg'
  if (id <= 800) return 'clear.svg'
  else return 'clouds.svg'
}

function getCurrentDate(){
  const currentDate = new Date();
  const options = {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  };
  return currentDate.toLocaleDateString('en-GB', options);
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
    return;
  }

  //change name city, temp,...
  console.log(weatherData);

  const {
    name: country,
    main: { temp: temperature, humidity },
    weather: [{ id, main }],
    wind: { speed }
  } = weatherData;

  cityName.textContent = country;
  temp.textContent = Math.round(temperature) + ' ℃';
  conditional.textContent = main;
  humidityValue.textContent = humidity + ' %';
  windSpeedValue.textContent = speed + 'M/s';
  currentDate.textContent = getCurrentDate();
  weatherSummaryImg.src = `./assets/weather/${getWheatherIcon(id)}`;

  // Gọi API dự báo thời tiết
  const forecastData = await getFectchData("forecast", city);
  displayWeatherForecast(forecastData);

  showDisplaySection(weatherInfor);
}

// Hàm hiển thị dự báo thời tiết cho các ngày tiếp theo
function displayWeatherForecast(data) {
  forecastContainer.innerHTML = ''; // Xóa dữ liệu cũ

  // Lọc các mục dự báo thời tiết (ví dụ: mỗi 24 giờ)
  const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

  dailyForecasts.forEach(day => {
    const date = new Date(day.dt_txt);
    const icon = day.weather[0].icon;
    const temperature = Math.round(day.main.temp);
    const description = day.weather[0].description;

    const forecastHTML = `
      <div class="forecast-day">
        <h3>${date.toLocaleDateString()}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
        <p>${temperature}°C</p>
        <p>${description}</p>
      </div>
    `;

    forecastContainer.innerHTML += forecastHTML;
  });
}
