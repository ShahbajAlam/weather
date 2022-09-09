const API_KEY = "5bc12161adce4ccca2193809220809";

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

const errorMessage = (errorObject) => {
    showBackdrop();
    modal.querySelector(".modal__message").textContent = errorObject.message;
    showModal();
};

//Getting user position=================================
const getUserPosition = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (e) => {
                showBackdrop();
                showLoader();
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
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=yes`
        );
        if (!response.ok) throw new Error();
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
        return weatherDetails;
    } catch {
        errorMessage(
            new Error(
                "Oops! Could not fetch some information. Please try again later"
            )
        );
    }
};

//Astronomy Info==============================
const getAstronomyInfo = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${lat},${lon}`
        );
        if (!response.ok) throw new Error();
        const data = await response.json();
        const astronomyDetails = {
            sunrise: data.astronomy.astro.sunrise,
            sunset: data.astronomy.astro.sunset,
            moonrise: data.astronomy.astro.moonrise,
            moonset: data.astronomy.astro.moonset,
            moonPhase: data.astronomy.astro.moon_phase,
        };
        return astronomyDetails;
    } catch {
        errorMessage(
            new Error(
                "Oops! Could not fetch some information. Please try again later"
            )
        );
    }
};

//Forecast Info==================================
const getForecastInfo = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=6`
        );
        if (!response.ok) throw new Error();
        const data = await response.json();
        const forecastDetails = data.forecast.forecastday;
        return forecastDetails;
    } catch {
        errorMessage(
            new Error(
                "Oops! Could not fetch some information. Please try again later"
            )
        );
    }
};

const updateFirstDivUI = (weatherDetails) => {
    if (!weatherDetails) return;
    city.innerHTML = weatherDetails.name;
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

        getWeatherInfo(lat, lon).then((weatherDetails) => {
            updateFirstDivUI(weatherDetails);
            updateThirdDivUI(weatherDetails);
        });

        getAstronomyInfo(lat, lon).then((astronomyDetails) => {
            updateSecondDivUI(astronomyDetails);
        });

        getForecastInfo(lat, lon).then((forecastDetails) => {
            updateFourthDivUI(forecastDetails);
            hideLoader();
            if (modal.classList.contains("hidden")) hideBackdrop();
        });
    } catch {
        errorMessage(
            new Error(
                "Oops! something went wrong, make sure to allow location permission"
            )
        );
        document.querySelector(".container").classList.add("hidden");
        document.querySelector(".get__weather").classList.remove("hidden");
    }
};

document.querySelector(".get__weather").addEventListener("click", () => {
    document.querySelector(".get__weather").classList.add("hidden");
    init();
    document.querySelector(".container").classList.remove("hidden");
});

document.body.addEventListener("click", () => {
    modal.classList.add("hidden");
    backdrop.classList.add("hidden");
});
