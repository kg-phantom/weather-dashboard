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
                var cityLatitude = data.coord.lat;
                var cityLongitude = data.coord.lon;
                
                getForecast(cityLatitude, cityLongitude);
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
                console.log(data);
            })
        }
    })
};
    
    

$("#submit-btn").on("click", submitHandler);