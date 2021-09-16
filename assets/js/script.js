var searchHistory = JSON.parse(localStorage.getItem("search history"));


var submitHandler = function(event) {
    event.preventDefault();
    var cityName = $("#city").val().trim();
    
    if(!cityName) {
        alert("Please enter a city name.");
        return;
    }

    getLatLong(cityName);
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
                
                localStorage.setItem("search history", JSON.stringify(searchHistory));
                localStorage.setItem("last search", cityName);
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

                console.log(dayjs.unix(data.daily[1].dt));

                // present current weather
                $("#current-temperature").text("Temp: " + data.current.temp + "°F");
                $("#current-wind").text("Wind: " + data.current.wind_speed + " MPH");
                $("#current-humidity").text("Humidity: " + data.current.humidity + "%");
                $("#current-uv").text(data.current.uvi).addClass("rounded-3");

                var weatherIcon = data.current.weather[0].icon;
                $("#current-icon").attr("src", "http://openweathermap.org/img/wn/" + weatherIcon + ".png");
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
}

$("#submit-btn").on("click", submitHandler);