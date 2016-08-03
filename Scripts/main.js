document.getElementById("coverBg").style.minHeight = window.outerHeight;
document.getElementById("overlay").style.minHeight = window.outerHeight;
document.getElementById("coverBg").style.backgroundImage = "url('https://source.unsplash.com/random')";
document.getElementById("wrapper").style.minHeight = window.outerHeight;
document.getElementById("currentCity").style.minHeight = window.outerHeight;

// var icon;
// var city;
// var country;
// var temp;
// var humidity;
// var desc;
// var date;
// var lat;
// var lon;
var currentData;
var forecastData;
var myScroll;
var myForecastScroll;

function forecastScroll(){
  myForecastScroll = new IScroll("#forecastWrapper",{
    scrollbars: true,
    interactiveScrollbars: true,
    scrollY: false,
    scrollX: true
  });
}

function iScroll(){
  myScroll = new IScroll("#wrapper",{
    scrollbars: true,
    interactiveScrollbars: true,
    scrollY: true,
    scrollX: false,
    mouseWheel: true,
    keyBindings: true,
    click: true
  });
}

// document.addEventListener("touchmove", function (e) { e.preventDefault(); }, false);
    
if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(locate, showError);
}
else{
  alert("Geolocation is not supported by this browser. Please search current location manually");
}

function locate(position){
  // lat = position.coords.latitude;
  // lon = position.coords.longitude;
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
    document.getElementById("cover").style.paddingTop = "8em";
    document.getElementById("cover").style.paddingBottom = "8em";

    document.getElementById("weatherIcon").src = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";

    switch(unit){
      case "F":
        document.getElementById("weather").innerHTML = "<p>Observe at:<br>" + response.name + ", " + response.sys.country + "<br>" + Math.round(response.main.temp * 9/5 - 459.67) + " °F" + "<br>" + "Humidity: " + response.main.humidity + "%" + "<br>" + (response.weather[0].description)[0].toUpperCase() + (response.weather[0].description).slice(1) + "<br><br>" + "Last updated:<br>" + new Date(response.dt * 1000).toString();
        document.getElementById("cBtn").style.backgroundColor = "";
        document.getElementById("fBtn").style.backgroundColor = "green";
        break;
        
      default:
        document.getElementById("weather").innerHTML = "<p>Observe at:<br>" + response.name + ", " + response.sys.country + "<br>" + Math.round(response.main.temp - 273.15) + " °C" + "<br>" + "Humidity: " + response.main.humidity + "%" + "<br>" + (response.weather[0].description)[0].toUpperCase() + (response.weather[0].description).slice(1) + "<br><br>" + "Last updated:<br>" + new Date(response.dt * 1000).toString();
        document.getElementById("cBtn").style.backgroundColor = "green";
        document.getElementById("fBtn").style.backgroundColor = "";
    }
  }
}

function showForecast(data, unit){
  
  var openTag = "<table id='forecastTable'><tr>";
  var closeTag = "<td><span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span></td></tr></table>";
  var content = "<td><span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span></td>";
  
  if(unit){
    for(i=0;i<data.cnt;i++){
      content += "<td><img src='http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png'>" + "<p>" + Math.round(data.list[i].main.temp * 9/5 - 459.67) + "°F</p>" + "<p>" + data.list[i].weather[0].main + "</p>" + "<p>" + new Date(data.list[i].dt * 1000).toLocaleTimeString() + "</p>" + "<p>" + new Date(data.list[i].dt * 1000).toLocaleDateString() + "</p></td>";
    }
  }
  else{
    for(i=0;i<data.cnt;i++){
      content += "<td><img src='http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png'>" + "<p>" + Math.round(data.list[i].main.temp - 273.15) + "°C</p>" + "<p>" + data.list[i].weather[0].main + "</p>" + "<p>" + new Date(data.list[i].dt * 1000).toLocaleTimeString() + "</p>" + "<p>" + new Date(data.list[i].dt * 1000).toLocaleDateString() + "</p></td>";
    }
  }
  
  document.getElementById("forecast").innerHTML = openTag + content + closeTag;
  document.getElementById("forecast").style.width = document.getElementById("forecastTable").offsetWidth + "px";
  // document.getElementById("scroller").style.height = document.getElementById("currentCity").offsetHeight + document.getElementById("forecastTable").offsetHeight + "px";
  // forecastScroll();
  // iScroll();
}

function popUp(){
  if(currentData){
    document.getElementById("popUpBox").style.visibility = "visible";
    document.getElementById("unitBtn").style.visibility = "hidden";
    document.getElementById("changeCity").style.visibility = "hidden";
  }
}

function search(popUp){
  if(popUp){
    document.getElementById("popUpBox").style.visibility = "hidden";
    document.getElementById("unitBtn").style.visibility = "visible";
    document.getElementById("changeCity").style.visibility = "visible";
    loaded(null, null, document.getElementById("popSearchBox").value);
    document.getElementById("popSearchBox").value = "";
  }
  else{
    loaded(null, null, document.getElementById("searchBox").value);
    document.getElementById("searchBox").value = "";
  }
}

function goBack(){
    document.getElementById("popUpBox").style.visibility = "hidden";
    document.getElementById("unitBtn").style.visibility = "visible";
    document.getElementById("changeCity").style.visibility = "visible";
    document.getElementById("popSearchBox").value = "";
}

function loaded(lat, lon, cityName){
  
  var xhttp;

  if (window.XMLHttpRequest){
    xhttp = new XMLHttpRequest();
  }
  else{
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xhttp.onreadystatechange = function (){
    if (xhttp.readyState == 4 && xhttp.status == 200){
      currentData = JSON.parse(xhttp.responseText);
      // icon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      // city = response.name;
      // country = response.sys.country;
      // temp = response.main.temp;
      // humidity = response.main.humidity;
      // desc = (response.weather[0].description)[0].toUpperCase() + (response.weather[0].description).slice(1);
      // date = new Date(response.dt * 1000).toLocaleString();
      // date = new Date(response.dt * 1000).toString();
      show(currentData);
      forecast(currentData.id);
    }
  };
  
  if(cityName){
    xhttp.open("GET","https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=9a879261281075d4881d5b80f7037d5d",true);
    xhttp.send();
  }
  else{
    xhttp.open("GET","https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=9a879261281075d4881d5b80f7037d5d",true);
    xhttp.send();
  }
}

function forecast(id){
  var xhttpForecast;

  if (window.XMLHttpRequest){
    xhttpForecast = new XMLHttpRequest();
  }
  else{
    xhttpForecast = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xhttpForecast.onreadystatechange = function (){
    if (xhttpForecast.readyState == 4 && xhttpForecast.status == 200){
      forecastData = JSON.parse(xhttpForecast.responseText);
      showForecast(forecastData);
      forecastScroll();
    }
  };
  
  xhttpForecast.open("GET","https://crossorigin.me/http://api.openweathermap.org/data/2.5/forecast?id=" + id + "&appid=9a879261281075d4881d5b80f7037d5d",true);
  xhttpForecast.send();
}

function enterDetect(event, opt){
  var e = event.which || event.keyCode;
  if (e == 13){
    if(opt){
      search(opt);
    }
    else{
      search();
    }
  }
}
