var submitHandler = function(event) {
    event.preventDefault();
    var cityName = $("#city").val().trim();
    
    if(!cityName) {
        alert("Please enter a city name.");
        return;
    }

    getForecast(cityName);
};

var getForecast = function(cityName) {
    var cityApiUrl = "api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=f2bfa297895a94ecb35e7601cf8f9413";

    fetch(cityApiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
            })
        }
    })

    // var forecastApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=f2bfa297895a94ecb35e7601cf8f9413";
    
    // fetch(forecastApiUrl)
    // .then(function(response) {
    //     if(response.ok) {
    //         response.json().then(function(data) {
    //             console.log(data);
    //         })
    //     }
    // })
}

$("#submit-btn").on("click", submitHandler);