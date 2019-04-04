document.getElementById("coverBg").style.backgroundImage = "url('https://source.unsplash.com/random')";
setInterval(function(){
    document.getElementById("scrollDown").style.opacity === "1" ? document.getElementById("scrollDown").style.opacity = "0" : document.getElementById("scrollDown").style.opacity = "1";
}, 500);

function scrollEffect(){
    if (window.pageYOffset !== undefined) {// All browsers, except IE9 and earlier
        if(window.pageYOffset + window.innerHeight - 100 > document.getElementById("currentCity").offsetHeight){
            document.getElementById("scrollDown").style.visibility = "hidden";
        }
    } else { // IE9 and earlier
        if(document.documentElement.scrollTop + window.innerHeight - 100 > document.getElementById("currentCity").offsetHeight){
            document.getElementById("scrollDown").style.visibility = "hidden";
        }
    }
}

function scrollToBottom(){
    var animation = setInterval(function(){
        if (document.body.scrollTop >= document.body.offsetHeight - document.documentElement.clientHeight){
        clearInterval(animation);
        }
    document.body.scrollTop += 15;
    }, 10);
}

var currentData;
var forecastData;
var myForecastScroll;

function forecastScroll(){
    myForecastScroll = new IScroll("#forecastWrapper",{
        scrollbars: true,
        interactiveScrollbars: true,
        scrollY: false,
        scrollX: true
    });
}
    
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(locate, showError);
} else {
    alert("Geolocation is not supported by this browser. Please search current location manually");
}

function locate(position){
    loaded(position.coords.latitude, position.coords.longitude);
}

function showError(error) {
    switch(error.code){
        case error.PERMISSION_DENIED:
            alert("Request for geolocation is denied. Please search current location manually");
        break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable. Please search current location manually");
        break;
        case error.TIMEOUT:
            alert("Request to get location timed out. Please search current location manually");
        break;
        case error.UNKNOWN_ERROR:
            alert("Warning: An unknown error occurred. Please search current location manually");
        break;
    }
}

function show(response, unit){

    if(response){

        document.getElementById("weatherIcon").style.height = "5em";
        document.getElementById("cover").style.position = "relative";
        document.getElementById("cover").style.top = "0";
        document.getElementById("cover").style.paddingTop = "5em";
        document.getElementById("cover").style.paddingBottom = "8em";

        document.getElementById("weatherIcon").src = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
    
        switch(unit){
            case 1:
                document.getElementById("weather").innerHTML = "<p>Observe At:</p><a href='javascript:popUp();' id='changeCity' class='shadow'>" + response.name + ", " + response.sys.country + " <span class='glyphicon glyphicon-search' aria-hidden='true' style='font-size:0.5em'></span></a><p id='temp'>" + Math.round(response.main.temp * 9/5 - 459.67)+ "°F</p>" + "<p class='shadow'>Humidity: " + response.main.humidity + "%</p><p class='shadow'>" + (response.weather[0].description)[0].toUpperCase() + (response.weather[0].description).slice(1) + "</p><a href='javascript:show(currentData);showForecast(forecastData);' id='cBtn' class='shadow'>°C</a>" + "  |  " + "<a href='javascript:show(currentData,1);showForecast(forecastData,1);' id='fBtn' class='shadow'>°F</a>";
        
                document.getElementById("footer").innerHTML = "<p>Last updated:</p><p>" + new Date(response.dt * 1000).toLocaleTimeString() + "</p><p>Powered by <a href='https://unsplash.com/' target='_blank'>Unsplash</a> & <a href='http://openweathermap.org/' target='_blank'>OpenWeatherMap</a></p>";
        
                document.getElementById("cBtn").style.opacity = "0.7";
                document.getElementById("cBtn").style.color = "lightgrey";
                document.getElementById("fBtn").style.opacity = "1";
                document.getElementById("fBtn").style.color = "white";
                break;
        
            default:
                document.getElementById("weather").innerHTML = "<p>Observe At:</p><a href='javascript:popUp();' id='changeCity' class='shadow'>" + response.name + ", " + response.sys.country + " <span class='glyphicon glyphicon-search' aria-hidden='true' style='font-size:0.5em'></span></a><p id='temp'>" + Math.round(response.main.temp - 273.15)+ "°C</p>" + "<p class='shadow'>Humidity: " + response.main.humidity + "%</p><p class='shadow'>" + (response.weather[0].description)[0].toUpperCase() + (response.weather[0].description).slice(1) + "</p><a href='javascript:show(currentData);showForecast(forecastData);' id='cBtn' class='shadow'>°C</a>" + "  |  " + "<a href='javascript:show(currentData,1);showForecast(forecastData,1);' id='fBtn' class='shadow'>°F</a>";
        
                document.getElementById("footer").innerHTML = "<p>Last updated:</p><p>" + new Date(response.dt * 1000).toLocaleTimeString() + "</p><p>Powered by <a href='https://unsplash.com/' target='_blank'>Unsplash</a> & <a href='http://openweathermap.org/' target='_blank'>OpenWeatherMap</a></p>";

                document.getElementById("cBtn").style.opacity = "1";
                document.getElementById("cBtn").style.color = "white";
                document.getElementById("fBtn").style.opacity = "0.7";
                document.getElementById("fBtn").style.color = "lightgrey";
        }

        forecast(response.id);
    }
}

function showForecast(data, unit){
  
    var openTag = "<table id='forecastTable'><tr>";
    var closeTag = "<td></td></tr></table>";
    var content = "<td></td>";
  
    if(unit){
        for(i=0;i<data.cnt;i++){
           content += "<td><img src='http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png'>" + "<p>" + Math.round(data.list[i].main.temp * 9/5 - 459.67) + "°F</p>" + "<p>" + data.list[i].weather[0].main + "</p>" + "<p>" + new Date(data.list[i].dt * 1000).toLocaleTimeString() + "</p>" + "<p>" + new Date(data.list[i].dt * 1000).toLocaleDateString() + "</p></td>";
        }
    } else {
        for(i=0;i<data.cnt;i++){
           content += "<td><img src='http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png'>" + "<p>" + Math.round(data.list[i].main.temp - 273.15) + "°C</p>" + "<p>" + data.list[i].weather[0].main + "</p>" + "<p>" + new Date(data.list[i].dt * 1000).toLocaleTimeString() + "</p>" + "<p>" + new Date(data.list[i].dt * 1000).toLocaleDateString() + "</p></td>";
        }
    }
  
    document.getElementById("forecast").innerHTML = openTag + content + closeTag;
    document.getElementById("forecast").style.width = document.getElementById("forecastTable").offsetWidth + "px";
}

function popUp(){
    if(currentData){
        document.getElementById("popUpBox").style.visibility = "visible";
        // document.getElementById("unitBtn").style.visibility = "hidden";
        // document.getElementById("changeCity").style.visibility = "hidden";
    }
}

function search(popUp){
    if(popUp){
        document.getElementById("popUpBox").style.visibility = "hidden";
        // document.getElementById("unitBtn").style.visibility = "visible";
        // document.getElementById("changeCity").style.visibility = "visible";
        loaded(null, null, document.getElementById("popSearchBox").value);
        document.getElementById("popSearchBox").value = "";
    } else {
        loaded(null, null, document.getElementById("searchBox").value);
        document.getElementById("searchBox").value = "";
    }
}

function goBack(){
    document.getElementById("popUpBox").style.visibility = "hidden";
    // document.getElementById("unitBtn").style.visibility = "visible";
    // document.getElementById("changeCity").style.visibility = "visible";
    document.getElementById("popSearchBox").value = "";
}

function loaded(lat, lon, cityName){

    document.documentElement.style.overflowY = "visible";
    document.body.style.overflowY = "visible";
    document.getElementById("scrollDown").style.visibility = "visible";
    
    var currentPadding = document.createElement("script");
    
    if(cityName){
        currentPadding.src = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&callback=show&appid=9a879261281075d4881d5b80f7037d5d";
        document.body.appendChild(currentPadding);
    } else {
        currentPadding.src = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&callback=show&appid=9a879261281075d4881d5b80f7037d5d";
        document.body.appendChild(currentPadding);
    }

//    var xhttp;
//
//    if (window.XMLHttpRequest){
//        xhttp = new XMLHttpRequest();
//    } else {
//        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
//    }
//
//    xhttp.onreadystatechange = function (){
//        if (xhttp.readyState == 4 && xhttp.status == 200){
//            currentData = JSON.parse(xhttp.responseText);
//            show(currentData);
//            forecast(currentData.id);
//            // document.getElementById("unitBtn").style.visibility = "visible";
//            // document.getElementById("changeCity").style.visibility = "visible";
//            document.documentElement.style.overflowY = "visible";
//            document.body.style.overflowY = "visible";
//            document.getElementById("scrollDown").style.visibility = "visible";
//        }
//    };
//  
//    if(cityName){
//        xhttp.open("GET","https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=9a879261281075d4881d5b80f7037d5d",true);
//        xhttp.send();
//    } else {
//        xhttp.open("GET","https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=9a879261281075d4881d5b80f7037d5d",true);
//        xhttp.send();
//    }
  
}

function forecast(id){

    var forecastPapping = document.createElement("script");

    forecastPapping.src = "http://api.openweathermap.org/data/2.5/forecast?id=" + id + "&callback=showForecast&appid=9a879261281075d4881d5b80f7037d5d";

    document.body.appendChild(forecastPapping);

    forecastScroll();

//    var xhttpForecast;
//
//    if (window.XMLHttpRequest){
//        xhttpForecast = new XMLHttpRequest();
//    } else {
//        xhttpForecast = new ActiveXObject("Microsoft.XMLHTTP");
//    }
//
//    xhttpForecast.onreadystatechange = function (){
//        if (xhttpForecast.readyState == 4 && xhttpForecast.status == 200){
//            forecastData = JSON.parse(xhttpForecast.responseText);
//            showForecast(forecastData);
//            forecastScroll();
//        }
//    };
//  
//    xhttpForecast.open("GET","https://crossorigin.me/http://api.openweathermap.org/data/2.5/forecast?id=" + id + "&appid=9a879261281075d4881d5b80f7037d5d",true);
//    xhttpForecast.send();
}

function enterDetect(event, opt){
    var e = event.which || event.keyCode;
    if (e == 13){
        if(opt){
            search(opt);
        } else {
            search();
        }
    }
}
