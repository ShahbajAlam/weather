const API_KEY = "5bc12161adce4ccca2193809220809";

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
//prettier-ignore
const uvIndexArray = ["Good","Moderate","Unhealthy","Unhealthy","Very Unhealthy","Hazardous",
];
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
const getWeatherInfo = async (lat, lon, city) => {
    const url = !city
        ? `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=yes`
        : `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`;
    try {
        showBackdrop();
        showLoader();
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 400)
                throw new Error(
                    city
                        ? `Sorry! Could not fetch information about "${city}", try other city or turn on location.`
                        : `Sorry! Could not fetch information for your location, try again later.`
                );
            throw new Error(
                `Sorry! Something went wrong, please try again later.`
            );
        }
        const data = await response.json();
        const weatherDetails = {
            airQuality: data.current.air_quality["us-epa-index"],
            name: data.location.name,
            region: data.location.region,
            description: data.current.condition.text,
            icon: data.current.condition.icon,
            feelsLike: data.current.feelslike_c,
            humidity: data.current.humidity,
            precipitation: data.current.precip_mm,
            temperature: data.current.temp_c,
            uvIndex: data.current.uv,
            windSpeed: data.current.wind_kph,
        };
        console.log(weatherDetails);
        return weatherDetails;
    } catch (e) {
        errorMessage(e.message);
        wholeContainer.classList.add("hidden");
    }
};

//Astronomy Info==============================
const getAstronomyInfo = async (lat, lon, city) => {
    const url = !city
        ? `https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${lat},${lon}`
        : `https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${city}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 400)
                throw new Error(
                    city
                        ? `Sorry! Could not fetch information about "${city}", try other city or turn on location.`
                        : `Sorry! Could not fetch information for your location, try again later.`
                );
            throw new Error(
                `Sorry! Something went wrong, please try again later.`
            );
        }
        const data = await response.json();
        const astronomyDetails = {
            sunrise: data.astronomy.astro.sunrise,
            sunset: data.astronomy.astro.sunset,
            moonrise: data.astronomy.astro.moonrise,
            moonset: data.astronomy.astro.moonset,
            moonPhase: data.astronomy.astro.moon_phase,
        };
        console.log(astronomyDetails);
        return astronomyDetails;
    } catch (e) {
        errorMessage(e.message);
        wholeContainer.classList.add("hidden");
    }
};

//Forecast Info==================================
const getForecastInfo = async (lat, lon, city) => {
    const url = !city
        ? `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=6`
        : `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=6`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 400)
                throw new Error(
                    city
                        ? `Sorry! Could not fetch information about "${city}", try other city or turn on location.`
                        : `Sorry! Could not fetch information for your location, try again later.`
                );
            throw new Error(
                `Sorry! Something went wrong, please try again later.`
            );
        }
        const data = await response.json();
        const forecastDetails = data.forecast.forecastday;
        console.log(forecastDetails);
        return forecastDetails;
    } catch (e) {
        errorMessage(e.message);
        wholeContainer.classList.add("hidden");
    }
};

const updateFirstDivUI = (weatherDetails) => {
    if (!weatherDetails) return;
    city.innerHTML = weatherDetails.region
        ? `${weatherDetails.name}, ${weatherDetails.region}`
        : weatherDetails.name;
    icon.setAttribute("src", weatherDetails.icon);
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
    description.innerHTML = weatherDetails.description;
    airQuality.innerHTML = uvIndexArray[weatherDetails.airQuality - 1];
    uvIndex.innerHTML = weatherDetails.uvIndex;
    precipitation.innerHTML = `${weatherDetails.precipitation}mm`;
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
        const day = new Date(String(forecastDetails[i].date)).getDay();
        const html = `
            <li class="forecast__details">
                <h2 class="forecast__day">${weekdays[day]}</h2>
                <div class="forecast__temp">
                <img src="${forecastDetails[i].day.condition.icon}" />
                <h1>${forecastDetails[i].day.avgtemp_c}&deg;C</h1>
                </div>
                <h1 class="forecast__desc">${forecastDetails[i].day.condition.text}</h1>
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
        const location = await getUserPosition();
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;

        getWeatherInfo(lat, lon, null).then((weatherDetails) => {
            updateFirstDivUI(weatherDetails);
            updateThirdDivUI(weatherDetails);
        });

        getAstronomyInfo(lat, lon, null).then((astronomyDetails) => {
            updateSecondDivUI(astronomyDetails);
        });

        getForecastInfo(lat, lon, null).then((forecastDetails) => {
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
    const enteredCityName = document.querySelector(".user__input input").value;
    document.querySelector(".user__input input").value = "";
    fetchInfoBtn.classList.add("hidden");
    hideCityInputDiv();
    wholeContainer.classList.remove("hidden");
    hideBackdrop();

    getWeatherInfo(null, null, enteredCityName).then((weatherDetails) => {
        updateFirstDivUI(weatherDetails);
        updateThirdDivUI(weatherDetails);
    });

    getAstronomyInfo(null, null, enteredCityName).then((astronomyDetails) => {
        updateSecondDivUI(astronomyDetails);
    });

    getForecastInfo(null, null, enteredCityName).then((forecastDetails) => {
        updateFourthDivUI(forecastDetails);
        hideLoader();
        if (modal.classList.contains("hidden")) hideBackdrop();
    });
});
