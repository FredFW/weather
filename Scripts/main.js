var icon;
var city;
var country;
var temp;
var humidity;
var desc;
var date;
var lat;
var lon;

if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(function(position){
    alert("done!");
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    alert(lat);
    alert(lon);
    loaded();
  });
}

function show(){
  document.getElementById("weatherIcon").src = icon;
  document.getElementById("weather").innerHTML = "<p>" + city + ", " + country + "<br>" + Math.round(temp - 273.15) + " °C" + "<br>" + "Humidity: " + humidity + "%" + "<br>" + desc + "<br>" + "Last updated: " + date;
}

function loaded(){
  
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

  xhttp.open("GET","http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=9a879261281075d4881d5b80f7037d5d",true);
  xhttp.send();
}

