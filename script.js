function weatherdash(){
    const inputEl = document.getElementById("city-search");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");4
    const currentWindEl = document.getElementById("wind-speed");
    const currentUVEl = document.getElementById("UV-index");
    const APIKey = "7a67c49e844e3746bd601e1f41c7f3b8"
    const historyEl = document.getElementById("history");
    let searchRecord = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchRecord);

function getcurrentWeather(cityName) {
    //  city name, execute a current weather from open weather map api
            let currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
            fetch(currentURL)
            .then(function(response){
                return response.json();
            })
            .then(function(response){
                console.log(response);
    
                const currentDate = new Date(response.dt*1000);
                console.log(currentDate);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                nameEl.innerHTML = response.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherPic = response.weather[0].icon;
                currentPicEl.setAttribute("src",  "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                currentPicEl.setAttribute("alt",response.weather[0].description);
                currentTempEl.innerHTML = "Temperature: " + ktof(response.main.temp) + " &#176F";
                currentHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
            let lat = response.coord.lat;
            let lon = response.coord.lon;
            console.log(lat);
            console.log(lon);
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
            console.log(UVQueryURL);
            fetch(UVQueryURL)
            .then(function(response){
                return response.json();
            })
            .then(function(response){
                console.log(response);
                let UVIndex = document.createElement("span");
                UVIndex.setAttribute("class","badge badge-danger");
                console.log(response.value);
                // UVIndex.innerHTML = response.value;
                currentUVEl.innerHTML = "UV Index: " + response.value;
            });
    // a 5-day forecast get request from open weather map api
            console.log(cityName);
            let forecastAPIURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
            fetch(forecastAPIURL)
            .then(function(response){
                return response.json();
            })
            .then(function(response){
                console.log(response);
                const forecastEls = document.querySelectorAll(".forecast-div");

                // forecastEls[i].innerHTML = "";
                // forecastEls.innerHTML="";
         
                for (i=0; i<forecastEls.length; i++) {
                    // forecastEls[i].innerHTML = "";
                    // forecastEls.innerHTML="";
                    const forecastIndex = i*8 + 4;
                    const forecastDate = new Date(response.list[forecastIndex].dt * 1000);
                    // console.log(forecastDate);
                    const forecasttime = forecastDate.getUTCHours()-5;
                    // console.log(forecasttime);
                    const forecastDay = forecastDate.getDate();
                    const forecastMonth = forecastDate.getMonth() + 1;
                    const forecastYear = forecastDate.getFullYear();
                    const forecastDateEl = document.createElement("p");
                    forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
                    forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear + "/AM" + forecasttime + ":00";
                    forecastEls[i].append(forecastDateEl);
                    const forecastWeatherEl = document.createElement("img");
                    forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.list[forecastIndex].weather[0].icon + "@2x.png");
                    forecastWeatherEl.setAttribute("alt",response.list[forecastIndex].weather[0].description);
                    forecastEls[i].append(forecastWeatherEl);
                    const forecastTempEl = document.createElement("p");
                    forecastTempEl.innerHTML = "Temp: " + ktof(response.list[forecastIndex].main.temp) + " &#176F";
                    forecastEls[i].append(forecastTempEl);
                    const forecastHumidityEl = document.createElement("p");
                    forecastHumidityEl.innerHTML = "Humidity: " + response.list[forecastIndex].main.humidity + "%";
                    forecastEls[i].append(forecastHumidityEl);
                    }
                })
            });  
        }
    
        searchEl.addEventListener("click",function() {
            const searchTerm = inputEl.value;
            getcurrentWeather(searchTerm);
            searchRecord.push(searchTerm);
            localStorage.setItem("search",JSON.stringify(searchRecord));
            rendersearchRecord();
        })
    
        clearEl.addEventListener("click",function() {
            searchRecord = [];
            rendersearchRecord();
        })
    
        function ktof(K) {
            return Math.floor((K - 273.15) *1.8 +32);
        }
    
        function rendersearchRecord() {
            historyEl.innerHTML = "";
            for (let i=0; i<searchRecord.length; i++) {
                const historyItem = document.createElement("input");
                // <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com"></input>
                historyItem.setAttribute("type","text");
                historyItem.setAttribute("readonly",true);
                historyItem.setAttribute("class", "form-control d-block bg-white");
                historyItem.setAttribute("value", searchRecord[i]);
                historyItem.addEventListener("click",function() {
                    getcurrentWeather(historyItem.value);
                })
                historyEl.append(historyItem);
            }
        }
    
        rendersearchRecord();
        if (searchRecord.length > 0) {
            getcurrentWeather(searchRecord[searchRecord.length - 1]);
        }
}
weatherdash()
