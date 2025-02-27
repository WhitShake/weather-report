
const state = {
    tempDeg: 0,
    defaultColor: "teal",
    cityName : "Seattle",
    defaultLandscape: "🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲",
    hotLandscape: "🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂",
    niceLandscape: "🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷",
    midLandscape: "🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃",
    increaseTempButton: null,
    decreaseTempButton: null,
    tempValue: null, 
    landscape: null,
    cityNameOutput : null,
    cityNameInput: null,
    currentWeatherButton : null,
    resetButton : null,
    skySelect : null,
    sky : null,
};

const setDefaultValues = () => {
    state.cityNameInput.value = `${state.cityName}`;
    state.cityNameOutput.textContent = `${state.cityName}`;
    state.landscape.textContent = `${state.defaultLandscape}`;
    tempValue.style.color = state.defaultColor;
    tempValue.textContent = 0;
    sky.textContent = "";
};

const registerEventHandlers = () => {
    state.increaseTempButton.addEventListener("click", increaseTemp, changeColor, changeLandscape);
    state.decreaseTempButton.addEventListener("click", decreaseTemp, changeColor, changeLandscape);
    state.currentWeatherButton.addEventListener("click", displayCurrentWeather);
    state.cityNameInput.addEventListener("input", displayCityName); 
    state.resetButton.addEventListener("click", setDefaultValues);
    state.skySelect.addEventListener("change", changeSky);
};

const loadControls = () => {
    state.increaseTempButton = document.getElementById("increaseTempControl");
    state.decreaseTempButton = document.getElementById("decreaseTempControl");
    state.cityNameInput = document.getElementById("cityNameInput");
    state.cityNameOutput = document.getElementById("headerCityName");
    state.currentWeatherButton = document.getElementById("currentTempButton");
    state.tempValue = document.getElementById("tempValue"); 
    state.landscape = document.getElementById("landscape");
    state.resetButton = document.getElementById("cityNameReset");
    state.skySelect = document.getElementById("skySelect");
    state.sky = document.getElementById("sky");
};

const increaseTemp = () => {
    state.tempDeg += 1;
    tempValue.textContent = `${state.tempDeg}`
    changeColor();
    changeLandscape();
};

const decreaseTemp = () => {
    state.tempDeg -= 1;
    tempValue.textContent = `${state.tempDeg}`;
    changeColor();
    changeLandscape();
};

const changeColor = () => {
    let currentTemp = tempValue.textContent;
    if (currentTemp >= 80) {
        tempValue.style.color = "red";
    } else if (currentTemp >= 70) {
        tempValue.style.color = "orange";
    } else if (currentTemp >= 60) {
        tempValue.style.color = "yellow";
    } else if (currentTemp >= 50) {
        tempValue.style.color = "green";
    } else {
        tempValue.style.color = "teal";
    }
};

const changeLandscape = () => {
    let currentTemp = tempValue.textContent;
    if (currentTemp >= 80) {
        landscape.textContent = `${state.hotLandscape}`;
    } else if (currentTemp >= 70) {
        landscape.textContent = `${state.niceLandscape}`;
    } else if (currentTemp >= 60) {
        landscape.textContent = `${state.midLandscape}`;
    } else {
        landscape.textContent = `${state.defaultLandscape}`;
    }
};

const displayCityName = (event) => {
    const cityInput = event.target.value; 
    state.cityNameOutput.textContent = cityInput;
};

const changeSky = () => {
    sky.textContent = `${skySelect.options[skySelect.selectedIndex].text}`;
}

const displayCurrentWeather = () => {
    findLatAndLon();
}

const findLatAndLon= (query) => {
    let latitude, longitude;
    axios.get('http://localhost:5000/location',
    {
        params: {
            q: `${state.cityNameOutput.textContent}`,
            format: 'json'
        }
})
.then( (response) => {
    latitude = response.data[0].lat;
    longitude = response.data[0].lon;
    console.log('success in findLatAndLon', latitude, longitude)
        
    findWeather(latitude, longitude); 
})
.catch( (error) => {
    console.log('error in findLatAndLon!');
})
};

const findWeather = (latitude, longitude) => {
    axios.get('http://localhost:5000/weather',
    {
        params: {
            format: 'json',
            lat: latitude,
            lon: longitude
        }
    })
    .then( (response) => {
    
    console.log('success in findWeather!', response.data.main.temp);
    state.tempDeg = Math.round((response.data.main.temp - 273.15) * 9/5 + 32);
    tempValue.textContent = `${state.tempDeg}`
    changeColor();
    changeLandscape();
    })
    .catch( (error) => {
        console.log('error in findWeather!');
    });
}

const onLoaded = () => {
    loadControls();
    setDefaultValues();
    registerEventHandlers();
};

onLoaded();