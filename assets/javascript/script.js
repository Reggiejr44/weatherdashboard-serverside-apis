var weatherDisplayFormEl = document.querySelector('#weather-form');
var cityNameEl = document.querySelector('#cityname');
var currentWeatherEl = document.querySelector("#currentWeather");
var fivedayEl = document.querySelector("#fivedayWeather");
var searchEl = document.querySelector("#search-button");
var weatherHistory = document.querySelector("#history");
var pastSearchHistory = JSON.parse(localStorage.getItem("search")) || [];
const key="1362316676e7462ce8cb9c952d85a52f"

 // Button for search for a city
var displayFormSubmitHandler = function (event) {
  event.preventDefault();

  var cityName = cityNameEl.value.trim();

  if (cityName.length > 0) {
    pastSearchHistory.push(cityName);
      getCityWeather(cityName);
      
      // Save searched city in local storage
      localStorage.setItem("search", JSON.stringify(pastSearchHistory));
      displaySearchHistory();
      cityNameEl.value = '';
  } else {
    alert('Please enter a city!');
  }
};

function displaySearchHistory(){
    weatherHistory.innerHTML = "";
    for (var i = 0; i < pastSearchHistory.length; i++) {
        var historyItems = document.createElement("input");
        historyItems.setAttribute("type", "text");
        historyItems.setAttribute("readonly", true);
        historyItems.setAttribute("class", "form-control d-block bg-white history-btns");
        historyItems.setAttribute("value", pastSearchHistory[i]);
        weatherHistory.append(historyItems);
    }    
        var myhistoryButtons = document.querySelectorAll(".history-btns")
          for (let i = 0; i< myhistoryButtons.length; i++){
            myhistoryButtons[i].addEventListener("click", function(){
            getCityWeather(myhistoryButtons[i].value);
            console.log(myhistoryButtons[i].value);
          })
        }
  };
  displaySearchHistory();
  weatherDisplayFormEl.addEventListener('submit', displayFormSubmitHandler);

function getCityWeather(city) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city+ "&limit=5"+"&appid=" + key;
  console.log(apiUrl)

  fetch(apiUrl)
    .then(function (response){
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          console.log(data.name);

          currentWeatherEl.classList.remove("d-none");

          // City name in card-body
          var currentcityTitle = document.querySelector("#cityTitle");
          currentcityTitle.innerText = data.name;
          
          // Date + Icon
          var todayDate = dayjs().format("dddd, MMMM D YYYY")
          currentcityTitle.innerHTML = data.name + " (" + todayDate + ") ";

          // Icon is an object, {icon: '02n'}, object inside array
          var iconUrl = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
          console.log(data.weather[0].icon);
          console.log(iconUrl);
          
          var todayIcon = document.createElement('img');
          todayIcon.src = iconUrl;
          document.getElementById('cityTitle').appendChild(todayIcon);
          
          // Temp
          var idTemp = document.querySelector("#temperature");
          idTemp.innerHTML = "Temp: " + ((data.main.temp - 273.15) * 1.8 + 32).toFixed(1) + " &#176F";
          
          // Wind
          var idWind = document.querySelector("#wind-speed");
          idWind.innerHTML = "Wind: " + data.wind.speed + " MPH";
          console.log(data.wind.speed);
          
          // Humidity
          var idHum = document.querySelector("#humidity");
          idHum.innerHTML = "Humidity: " + data.main.humidity + "%";
          console.log(data.main.humidity);
        })
      }})
      
      // Parse response to display forecast for next 5 days
      var fiveDaysUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city+"&appid=" + key +"&cnt=5";
      console.log(fiveDaysUrl)
  
    fetch(fiveDaysUrl)
      .then(function (response){
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
        
            fivedayEl.classList.remove("d-none");
        
        // Loop for 5-day forecast date + icon, temp, wind, humidity
        var forecastEls = document.querySelectorAll(".forecast");
        
        for (i = 0; i < forecastEls.length; i++) {
        forecastEls[i].innerHTML = "";

          var iconUrl = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png";
          var forecastWeatherEl = document.createElement('div');

          var forecastDate = dayjs().add(i+1, 'day').format("dddd, MMMM D YYYY")
          var forecastDateDisplay = document.createElement('h5');
          forecastDateDisplay.textContent = forecastDate;
          forecastWeatherEl.append(forecastDateDisplay);

          var forecastIcon = document.createElement('img');
          forecastIcon.src = iconUrl;
          forecastWeatherEl.append(forecastIcon);

          var forecastTemp = document.createElement("p");
          forecastTemp.innerHTML = "Temp: " + ((data.list[i].main.temp - 273.15) * 1.8 + 32).toFixed(1) + " &#176F";
          forecastWeatherEl.append(forecastTemp);

          var forecastWind = document.createElement("p");
          forecastWind.innerHTML = "Wind: " + data.list[i].wind.speed + " MPH";
          forecastWeatherEl.append(forecastWind);

          var forecastHum = document.createElement("p");
          forecastHum.innerHTML = "Humidity: " + data.list[i].main.humidity + "%";
          forecastWeatherEl.append(forecastHum);

          forecastEls[i].append(forecastWeatherEl);
        }
      })    
    }
  })
};