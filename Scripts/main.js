document.getElementById("coverBg").style.backgroundImage = "url('https://source.unsplash.com/random')";
// document.getElementById("currentCity").style.backgroundImage = "url('https://source.unsplash.com/random')";

var icon;
var city;
var country;
var temp;
var humidity;
var desc;
var date;
var lat;
var lon;
var myScroll;

function scroll(){
  myScroll = new IScroll("#wrapper",{
    bounce: false,
    mouseWheel: true,
    scrollbars: true,
    interactiveScrollbars: true,
    keyBindings: true,
    click: true,
    indicators: [{
			el: document.getElementById('coverBgTop'),
			resize: false,
			ignoreBoundaries: true,
			speedRatioY: 0.2
		}]
  });
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    
if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(locate, showError);
}
else{
  alert("Geolocation is not supported by this browser. Please search current location manually");
}

function locate(position){
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  loaded();
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

function show(unit){
  if(city){
    
    document.getElementById("weatherIcon").src = icon;
    
    switch(unit){
      case "F":
        document.getElementById("weather").innerHTML = "<p>Observe at:<br>" + city + ", " + country + "<br>" + Math.round(temp * 9/5 - 459.67) + " °F" + "<br>" + "Humidity: " + humidity + "%" + "<br>" + desc + "<br><br>" + "Last updated:<br>" + date;
        document.getElementById("cBtn").style.backgroundColor = "";
        document.getElementById("fBtn").style.backgroundColor = "green";
        break;
      default:
        document.getElementById("weather").innerHTML = "<p>Observe at:<br>" + city + ", " + country + "<br>" + Math.round(temp - 273.15) + " °C" + "<br>" + "Humidity: " + humidity + "%" + "<br>" + desc + "<br><br>" + "Last updated:<br>" + date;
        document.getElementById("cBtn").style.backgroundColor = "green";
        document.getElementById("fBtn").style.backgroundColor = "";
        setTimeout(function() {
          myScroll.refresh();
        }, 0);
    }
  }
}

function popUp(){
  if(city){
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
    loaded(document.getElementById("popSearchBox").value);
    document.getElementById("popSearchBox").value = "";
  }
  else{
    loaded(document.getElementById("searchBox").value);
    document.getElementById("searchBox").value = "";
  }
}

function goBack(){
    document.getElementById("popUpBox").style.visibility = "hidden";
    document.getElementById("unitBtn").style.visibility = "visible";
    document.getElementById("changeCity").style.visibility = "visible";
    document.getElementById("popSearchBox").value = "";
}

function loaded(cityName){
  
  var xhttp;

  if (window.XMLHttpRequest){
    xhttp = new XMLHttpRequest();
  }
  else{
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xhttp.onreadystatechange = function (){
    if (xhttp.readyState == 4 && xhttp.status == 200){
      var response = JSON.parse(xhttp.responseText);
      icon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      city = response.name;
      country = response.sys.country;
      temp = response.main.temp;
      humidity = response.main.humidity;
      desc = (response.weather[0].description)[0].toUpperCase() + (response.weather[0].description).slice(1);
      date = new Date(response.dt * 1000).toLocaleString();
      show();
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


