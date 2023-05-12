// alert('Allow location to this app');

const contentContainer = document.querySelector('.content');

// start get weather current location
async function success(pos) {
  const cord = pos.coords;
  const lat = cord.latitude;
  const lon = cord.longitude;

  const getCity = await getCityLocation(lat, lon);
  const newCity = getCity.split(' ');
  const city = await getTodayWeather(newCity[0]);
  updateUITodayWeather(city);
  
}

function error(err) {
  if(err.code == 1) {
    alert(`Error ${err.code}, ${err.message}`);
  }
  hideLoader();
  document.querySelector('.content').style.visibility = 'visible';
  return response.results[0].locations[0].adminArea5;
}

navigator.geolocation.getCurrentPosition(success, error);

function getCityLocation(lat, lon) {
  showLoader();
  const key = `HCSpUGxC6uKJqNw5qQ0jZTLHhC9IWAjU`;
  return fetch(`https://www.mapquestapi.com/geocoding/v1/reverse?key=${key}&location=${lat},${lon}&includeRoadMetadata=true&includeNearestIntersection=true`)
    .then(response => response.json())
    .then(response =>  {
      hideLoader();
      document.querySelector('.content').style.visibility = 'visible';
      return response.results[0].locations[0].adminArea5;
    });
}
// end get weaterh current location


// get get timezone
const timezone = document.querySelector('.timezone');
timezone.innerHTML = getDate();

function getDate() {
  const time = new Date();
  let day = time.getDay();
  const date = time.getDate();
  let month = time.getMonth() + 1;

  switch(day) {
    case 0:
      day = 'Sun';
      break;
    case 1:
      day = 'Mon';
      break;
    case 2:
      day = 'Tues';
      break;
    case 3:
      day = 'Wed';
      break;
    case 4:
      day = 'Thurs';
      break;
    case 5:
      day = 'Fri';
      break;
    case 6:
      day = 'Sat';
      break;
    default:
  }
  
  switch(month) {
    case 1:
      month = 'Jan';
      break;
    case 2:
      month = 'Feb';
      break;
    case 3:
      month = 'Mar';
      break;
    case 4:
      month = 'Apr';
      break;
    case 5:
      month = 'May';
      break;
    case 6:
      month = 'Jun';
      break;
    case 7:
      month = 'Jul';
      break;
    case 8:
      month = 'Aug';
      break;
    case 9:
      month = 'Sep';
      break;
    case 10:
      month = 'Oct';
      break;
    case 11:
      month = 'Sep';
      break;
    case 12:
      month = 'Des';
      break;
    default:
  }

  const today = `${day}, ${date} ${month}`;
  return today;
}
// end get timezone


// get weather input user based
const search = document.querySelector('.input-search');
search.addEventListener('keypress', async function(e) {
  if (e.key === 'Enter') {
    try {
      const inputSearch = document.querySelector('.input-search');
      const todayWeather = await getTodayWeather(inputSearch.value);
      updateUITodayWeather(todayWeather);
      inputSearch.value = '';
    } catch (err) {
      alert(err);
    }
  }
});

// get weather
function getTodayWeather(keyword) {
  const apiKey = `4ad9126a1f97c33e5930db5297993398`;
  return fetch (`https://api.openweathermap.org/data/2.5/weather?q=${keyword}&units=imperial&appid=${apiKey}`)
    .then(response => {
      if(!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(response => {
      return response;
    });
};


// start function update ui
function updateUITodayWeather(weather) {
  getPlace(weather);
  getForecastWeatherIcon(weather);
  getForecastWeatherTemp(weather);
  getDetailWeather(weather)
  
}

function getForecastWeatherIcon(weather) {
  const icon = document.querySelector('.iconurl');
  let url = "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png";
  icon.src = url;
}

function getForecastWeatherTemp(weather) {
  const temp = document.querySelector('.temp');
  const deg = document.querySelector('.deg');
  const feelsLike = document.querySelector('.feels-like');
  
  const wt = weather.main.temp;
  const celciusTemp = (5/9) * (wt - 32);
  const fl = weather.main.feels_like;
  const feel = (5/9) * (fl - 32);

  temp.innerHTML = Math.round(celciusTemp);
  deg.innerHTML = '&degC';
  feelsLike.innerHTML = Math.round(feel);
}

function getPlace(weather) {
  const place = document.querySelector('.place');
  const city = weather.name;
  const countryID = weather.sys.country;

  place.innerHTML = `${city}, ${countryID}`;
  place.style.display = 'block';
}

function getDetailWeather(weather) {
  const windSpeed = document.querySelector('.info-wind');
  const humidity = document.querySelector('.info-humidity');
  const pressure = document.querySelector('.info-pressure');
  const sunrise = document.querySelector('.info-sunrise');
  const sunset = document.querySelector('.info-sunset');
  const visibility = document.querySelector('.info-visibility')

  const getWindSpeed = weather.wind.speed;
  const getHumadity = weather.main.humidity;
  const getPressure = weather.main.pressure;
  const getSunrise = weather.sys.sunrise;
  const getSunset = weather.sys.sunset;
  const getVisibility = weather.visibility;

  let unixSunrise = getSunrise;
  let dateSunrise = new Date(unixSunrise*1000);
  let hoursSunrise = dateSunrise.getHours();
  let minutesSunrise = dateSunrise.getMinutes();

  let unixSunset = getSunset;
  let dateSunset = new Date(unixSunset*1000);
  let hoursSunset = dateSunset.getHours();
  let minutesSunset = dateSunset.getMinutes();
  
  windSpeed.innerHTML = getWindSpeed + ' kph';
  humidity.innerHTML = getHumadity + '%';
  pressure.innerHTML = getPressure + 'hPa';
  sunrise.innerHTML = `${hoursSunrise}.${minutesSunrise}am`;
  sunset.innerHTML = `${hoursSunset}.${minutesSunset}pm`;
  visibility.innerHTML = (getVisibility/1000) + 'km';

}
// end function update ui

// start loading
const spinner = document.querySelector('.spin');
function showLoader() {
  spinner.style.display = 'block';
}

function hideLoader() {
  spinner.style.display = 'none';
}