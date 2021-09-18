var searchHistory = JSON.parse(localStorage.getItem("search history"));


var submitHandler = function(event) {
    event.preventDefault();
    var initialCityName = $("#city").val().trim();
    
    if(!initialCityName) {
        alert("Please enter a city name.");
        return;
    }

    // title case city name
    var cityName = initialCityName.split(" ");

    if(cityName.length === 1) {
        cityName = cityName.toString();
        cityName = cityName.charAt(0).toUpperCase() + cityName.substr(1).toLowerCase();
    }
    else {
        for(var i = 0; i < cityName.length; i++) {
            cityName[i] = cityName[i][0].toUpperCase() + cityName[i].substr(1).toLowerCase();
        }
        cityName = cityName.join(" ");
    }

    getLatLong(cityName);

    $("#city").val("");
};

var displaySearches = function() {
    if($("#history-btns button")) {
        $("#history-btns button").each(function() {
            this.remove();
        });
    }
    
    for(var i = 0; i < searchHistory.length; i++) {
        var searchHistoryButton = $("<button>").text(searchHistory[i]);
        searchHistoryButton.addClass("w-100 btn p-1 mt-2");

        $("#history-btns").append(searchHistoryButton);
    }

    $("#history-btns button").on("click", function(event) {
        var cityName = event.target.textContent;
        getLatLong(cityName);
    });
};

var getLatLong = function(cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=f2bfa297895a94ecb35e7601cf8f9413";

    fetch(apiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                $("#city-name").text(cityName);
                
                var cityLatitude = data.coord.lat;
                var cityLongitude = data.coord.lon;
                
                getForecast(cityLatitude, cityLongitude);

                // save to search history
                searchHistory.push(cityName);
                
                for(var i = 0; i < searchHistory.length - 1; i++) {
                    if(searchHistory[i] === searchHistory[searchHistory.length - 1]) {
                        searchHistory.splice(searchHistory.length - 1, 1);
                    }
                }

                if(searchHistory.length > 10) {
                    searchHistory.splice(0, 1);
                };
                
                localStorage.setItem("search history", JSON.stringify(searchHistory));
                localStorage.setItem("last search", cityName);

                displaySearches();
            })
        }
        else {
            alert("There was a problem with your request.");
        }
    })
};

var getForecast = function(cityLatitude, cityLongitude) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLatitude + "&lon=" + cityLongitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=f2bfa297895a94ecb35e7601cf8f9413";
            
    fetch(apiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                var currentDate = dayjs.unix(data.current.dt).format("(M/D/YYYY)");
                $("#current-date").text(currentDate);

                // present current weather
                $("#current-temperature").text("Temp: " + data.current.temp + "°F");
                $("#current-wind").text("Wind: " + data.current.wind_speed + " MPH");
                $("#current-humidity").text("Humidity: " + data.current.humidity + "%");
                $("#current-uv").text(data.current.uvi).removeClass();
                
                if(data.current.uvi <= 2) {
                    $("#current-uv").addClass("fs-6 rounded-3 text-light bg-success");
                }
                else if(data.current.uvi <= 5) {
                    $("#current-uv").addClass("fs-6 rounded-3 text-light bg-warning");
                }
                else if(data.current.uvi <= 7) {
                    $("#current-uv").addClass("fs-6 rounded-3 text-light bg-orange");
                }
                else if(data.current.uvi <= 10) {
                    $("#current-uv").addClass("fs-6 rounded-3 text-light bg-danger");
                }
                else {
                    $("#current-uv").addClass("fs-6 rounded-3 text-light bg-purple");
                };

                // display current weather icon
                var weatherIcon = data.current.weather[0].icon;
                $("#current-icon").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + ".png");

                for(var i = 1; i < 6; i++) {
                    var forecastDayEl = $("#day" + i);
                    var forecastDate = dayjs.unix(data.daily[i].dt).format("M/D/YYYY");
                    forecastDayEl.find("h4").text(forecastDate);

                    weatherIcon = data.daily[i].weather[0].icon;
                    forecastDayEl.find("img").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + ".png");

                    forecastDayEl.find("p.temp").text("Temp: " + data.daily[i].temp.day + "°F");

                    forecastDayEl.find("p.wind").text("Wind: " + data.daily[i].wind_speed + " MPH");

                    forecastDayEl.find("p.humidity").text("Humidity: " + data.daily[i].humidity + "%");
                } 
            })
        }
    })
};

if(!searchHistory) {
    searchHistory = [];
    // placeholder for first time load
    getLatLong("Los Angeles");
} else {
    // display weather for previous search
    getLatLong(localStorage.getItem("last search"));
};

displaySearches();

$("#submit-btn").on("click", submitHandler);