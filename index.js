const API_KEY = "af53d1b45bcc31d873f46bfb6282626e";

const wholeContainer = document.querySelector(".container");

//First Div
const firstDiv = document.querySelector(".first__div");
const city = document.querySelector(".city");
const icon = document.querySelector(".weather__icon");
const temperature = document.querySelector(".temp");
const day = document.querySelector(".day");
const date = document.querySelector(".date");

//Second Div
const secondDiv = document.querySelector(".second__div");
const sunrise = document.querySelector(".sunrise h1");
const sunset = document.querySelector(".sunset h1");
const moonrise = document.querySelector(".moonrise h1");
const moonset = document.querySelector(".moonset h1");
const moonPhase = document.querySelector(".moon__phase");

//Third Div
const thirdDiv = document.querySelector(".third__div");
const description = document.querySelector(".description");
const airQuality = document.querySelector(".air__quality h1");
const uvIndex = document.querySelector(".uv__index h1");
const precipitation = document.querySelector(".precipitation h1");
const humidity = document.querySelector(".humidity h1");
const feelsLike = document.querySelector(".feels__like h1");
const windSpeed = document.querySelector(".wind__speed h1");

//Fourth Div
const forecastHeading = document.querySelector(".forecast__heading");
const copyright = document.querySelector(".copyright");
const modal = document.querySelector(".modal");
const backdrop = document.querySelector(".backdrop");
const fetchInfoBtn = document.querySelector(".get__weather");
const searchBtn = document.querySelector(".user__input button");

//prettier-ignore
const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday", "Friday","Saturday"];
//prettier-ignore
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const aqi = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

const geocoding = async (city) => {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length === 0) {
        errorMessage(
            `Sorry! could not find any information for ${city.toUpperCase()}`
        );
        return;
    }
    const { lat, lon } = data[0];
    return [lat, lon];
};

const reverseGeocoding = async (lat, lon) => {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data[0].name;
};

const getAirQuality = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return aqi[data.list[0].main.aqi - 1];
};

const unixToFormattedTime = (time) => {
    const formattedTime = new Date(time * 1000);
    const hours =
        formattedTime.getHours() > 12
            ? formattedTime.getHours() - 12
            : formattedTime.getHours();
    const minutes = formattedTime.getMinutes();
    const indicator = formattedTime.getHours() >= 12 ? "PM" : "AM";
    return `${String(hours).padStart(2, 0)}:${String(minutes).padStart(
        2,
        0
    )} ${indicator}`;
};

const moonPhaseChecker = (phase) => {
    if (phase === 0 || phase === 1) return "New Moon";
    if (phase === 0.25) return "First Quarter";
    if (phase === 0.5) return "Full Moon";
    if (phase === 0.75) return "Last Quarter";
    if (phase > 0 && phase < 0.25) return "Waxing Crescent";
    if (phase > 0.25 && phase < 0.5) return "Waxing Gibbous";
    if (phase > 0.5 && phase < 0.75) return "Waning Gibbous";
    if (phase > 0.75 && phase < 1) return "Waning Crescent";
};

const weatherDetails = {};

const timeNow = new Date();

//Layouts========================================
const showBackdrop = () => {
    backdrop.classList.remove("hidden");
};

const hideBackdrop = () => {
    backdrop.classList.add("hidden");
};

const showLoader = () => {
    backdrop.querySelector("img").classList.remove("hidden");
};

const hideLoader = () => {
    backdrop.querySelector("img").classList.add("hidden");
};

const showModal = () => {
    modal.classList.remove("hidden");
};

const hideModal = () => {
    modal.classList.add("hidden");
};

const errorMessage = (errorMsg) => {
    showBackdrop();
    modal.querySelector(".modal__message").textContent = errorMsg;
    showModal();
};

//Getting user position=================================
const getUserPosition = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (e) => {
                resolve(e);
            },
            () => {
                reject();
            },
            { enableHighAccuracy: true }
        );
    });
};

//Weather Info=================================
const getWeatherInfo = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    try {
        showBackdrop();
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Sorry! Something went wrong, please try again later.`
            );
        }
        const data = await response.json();

        weatherDetails.temperature = data.current.temp.toFixed(1);
        weatherDetails.humidity = data.current.humidity;
        weatherDetails.feelsLike = data.current.feels_like.toFixed(1);
        weatherDetails.uvIndex = data.current.uvi;
        weatherDetails.sunrise = unixToFormattedTime(data.current.sunrise);
        weatherDetails.sunset = unixToFormattedTime(data.current.sunset);
        weatherDetails.moonrise = unixToFormattedTime(data.daily[0].moonrise);
        weatherDetails.moonset = unixToFormattedTime(data.daily[0].moonset);
        weatherDetails.moonPhase = moonPhaseChecker(data.daily[0].moon_phase);
        weatherDetails.description = data.current.weather[0].description;
        weatherDetails.icon = data.current.weather[0].icon;
        weatherDetails.windSpeed = (data.current.wind_speed * 3.6).toFixed(1);
        weatherDetails.pop = data.daily[0]?.pop;
        weatherDetails.rain = data.daily[0]?.rain;
        return weatherDetails;
    } catch (e) {
        errorMessage(e.message);
        wholeContainer.classList.add("hidden");
    }
};

//Forecast Info==================================
const getForecastInfo = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Sorry! Something went wrong, please try again later.`
            );
        }
        const data = await response.json();
        return data.daily;
    } catch (e) {
        errorMessage(e.message);
        wholeContainer.classList.add("hidden");
    }
};

const updateFirstDivUI = (weatherDetails) => {
    if (!weatherDetails) return;
    city.innerHTML = weatherDetails.name;
    icon.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${weatherDetails.icon}@2x.png`
    );
    temperature.innerHTML = `${weatherDetails.temperature}&deg;C`;
    day.innerHTML = weekdays[timeNow.getDay()];
    date.innerHTML = `${String(timeNow.getDate()).padStart(2, 0)} ${
        months[timeNow.getMonth()]
    }`;
};

const updateSecondDivUI = (astronomyDetails) => {
    if (!astronomyDetails) return;
    sunrise.innerHTML = astronomyDetails.sunrise;
    sunset.innerHTML = astronomyDetails.sunset;
    moonrise.innerHTML = astronomyDetails.moonrise;
    moonset.innerHTML = astronomyDetails.moonset;
    moonPhase.innerHTML = astronomyDetails.moonPhase;
    secondDiv.style.opacity = 1;
};

const updateThirdDivUI = (weatherDetails) => {
    if (!weatherDetails) return;
    description.innerHTML = `${String(
        weatherDetails.description
    )[0].toUpperCase()}${String(weatherDetails.description).slice(1)}`;
    airQuality.innerHTML = weatherDetails.airQuality;
    uvIndex.innerHTML = weatherDetails.uvIndex;
    precipitation.innerHTML = weatherDetails.rain
        ? `${weatherDetails.rain}mm`
        : `${weatherDetails.pop * 100}% probability`;
    humidity.innerHTML = `${weatherDetails.humidity}%`;
    feelsLike.innerHTML = `${weatherDetails.feelsLike}&deg;C`;
    windSpeed.innerHTML = `${weatherDetails.windSpeed}km/h`;
    firstDiv.style.opacity = 1;
    thirdDiv.style.opacity = 1;
};

const updateFourthDivUI = (forecastDetails) => {
    if (!forecastDetails) {
        copyright.classList.remove("hidden");
        copyright.querySelector("span").innerHTML = timeNow.getFullYear();
        return;
    }
    for (let i = 1; i < forecastDetails.length; i++) {
        const day = new Date(forecastDetails[i].dt * 1000).getDay();
        const html = `
            <li class="forecast__details">
                <h2 class="forecast__day">${weekdays[day]}</h2>
                <div class="forecast__temp">
                <img src="https://openweathermap.org/img/wn/${
                    forecastDetails[i].weather[0].icon
                }@2x.png" />
                <h1>${(
                    (forecastDetails[i].temp.min +
                        forecastDetails[i].temp.max) /
                    2
                ).toFixed(1)}&deg;C</h1>
                </div>
                <h1 class="forecast__desc">${String(
                    forecastDetails[i].weather[0].description
                )[0].toUpperCase()}${String(
            forecastDetails[i].weather[0].description
        ).slice(1)}</h1>
            </li>
        `;
        document.querySelector(".heading").classList.remove("hidden");
        forecastHeading.insertAdjacentHTML("beforeend", html);
        copyright.classList.remove("hidden");
        copyright.querySelector("span").innerHTML = timeNow.getFullYear();
    }
};

const init = async () => {
    try {
        showLoader();
        const location = await getUserPosition();
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;

        reverseGeocoding(lat, lon).then((data) => {
            weatherDetails.name = data;
        });

        getAirQuality(lat, lon).then((data) => {
            weatherDetails.airQuality = data;
        });

        getWeatherInfo(lat, lon).then((weatherDetails) => {
            updateFirstDivUI(weatherDetails);
            updateSecondDivUI(weatherDetails);
            updateThirdDivUI(weatherDetails);
        });

        getForecastInfo(lat, lon).then((forecastDetails) => {
            updateFourthDivUI(forecastDetails);
            hideLoader();
            if (modal.classList.contains("hidden")) hideBackdrop();
        });
    } catch {
        showBackdrop();
        showCityInputDiv();
        wholeContainer.classList.add("hidden");
        fetchInfoBtn.classList.remove("hidden");
    }
};

fetchInfoBtn.addEventListener("click", () => {
    fetchInfoBtn.classList.add("hidden");
    init();
    wholeContainer.classList.remove("hidden");
});

backdrop.addEventListener("click", () => {
    fetchInfoBtn.classList.remove("hidden");
    modal.classList.add("hidden");
    backdrop.classList.add("hidden");
    hideCityInputDiv();
});

const showCityInputDiv = () => {
    document.querySelector(".user__input").classList.remove("hidden");
};

const hideCityInputDiv = () => {
    document.querySelector(".user__input").classList.add("hidden");
};

searchBtn.addEventListener("click", () => {
    const enteredCityName = document
        .querySelector(".user__input input")
        .value.trim();
    document.querySelector(".user__input input").value = "";
    if (!enteredCityName) {
        hideCityInputDiv();
        fetchInfoBtn.classList.add("hidden");
        errorMessage(
            "This input field can not be empty, please enter some city name"
        );
        return;
    }
    fetchInfoBtn.classList.add("hidden");
    hideCityInputDiv();
    wholeContainer.classList.remove("hidden");
    hideBackdrop();

    geocoding(enteredCityName).then((data) => {
        if (!data) return;
        const [lat, lon] = data;
        weatherDetails.name = `${enteredCityName
            .at(0)
            .toUpperCase()}${enteredCityName.slice(1).toLowerCase()}`;

        getAirQuality(lat, lon).then((data) => {
            weatherDetails.airQuality = data;
        });

        getWeatherInfo(lat, lon).then((weatherDetails) => {
            updateFirstDivUI(weatherDetails);
            updateSecondDivUI(weatherDetails);
            updateThirdDivUI(weatherDetails);
        });

        getForecastInfo(lat, lon).then((forecastDetails) => {
            updateFourthDivUI(forecastDetails);
            hideLoader();
            if (modal.classList.contains("hidden")) hideBackdrop();
        });
    });
});

const changeColorOnScroll = () => {
    if (window.scrollY > document.documentElement.clientHeight / 3) {
        document.documentElement.style.setProperty("--bg", "rgba(0,0,0,0.7)");
    }
    if (window.scrollY < document.documentElement.clientHeight / 3) {
        document.documentElement.style.setProperty("--bg", "#4c83ff");
    }
};

window.addEventListener("scroll", changeColorOnScroll);
