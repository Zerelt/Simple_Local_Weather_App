$(document).ready(function() {

    var x = 0; //lat coord
    var y = 0; //long coord
    var showTempC; //display temp in Celsius
    var showTempF; //display temp in Fahrenheit

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function(position) {
            x = position.coords.latitude;
            y = position.coords.longitude;
            var accuracy = position.coords.accuracy;

            $.getJSON("https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?lat=" + x + "&lon=" + y + "&APPID=69529e1042d73d1840a0a3583aa38731", function(json) {

                /*note that the standard/default measuring unit for temperature that the openweather api uses is Kelvin;
          to get it to show the temperature in C or F you need to add &units=metric or &units=imperial after your api key;
          but i noticed that the temperatures that it returns like this were off by around 2 integers so i prefer manually converting them from kelvin;*/
                showTempC = (json.main.temp - 273.15).toFixed(2);
                showTempF = (json.main.temp * 9 / 5 - 459.67).toFixed(2);

                $("#tempF").prop("checked", "checked");
                $("#temp2").text(showTempF + " F");
                $("#tempC").click(function() {
                    $("#temp2").text(showTempC + " ºC");
                });
                $("#tempF").click(function() {
                    $("#temp2").text(showTempF + " F");
                });

                $("#weatherIcon").attr("src", "https://crossorigin.me/http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
                $("#location").text(json.name + "," + json.sys.country);
                $("#weather").text(json.weather[0].description);
                $("#wind").text(json.wind.speed + " knots wind");
            });

            //If a city name is inputed:
            $("#cityBtn").click(function() {
                var city = $("#cityName").val();
                $("#tempF").attr("checked", "checked");
                if (city.length > 1) {
                    $.getJSON("https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=69529e1042d73d1840a0a3583aa38731", function(json2) {
                        showTempC = (json2.main.temp - 273.15).toFixed(2);
                        showTempF = (json2.main.temp * 9 / 5 - 459.67).toFixed(2);
                        $("#tempF").prop("checked", "checked");
                        $("#temp2").text(showTempF + " F");
                        $("#tempC").click(function() {
                            $("#temp2").text(showTempC + " ºC");
                        });
                        $("#tempF").click(function() {
                            $("#temp2").text(showTempF + " F");
                        });
                        $("#weatherIcon").attr("src", "https://crossorigin.me/http://openweathermap.org/img/w/" + json2.weather[0].icon + ".png");
                        $("#location").text(json2.name + "," + json2.sys.country);
                        $("#weather").text(json2.weather[0].description);
                        $("#wind").text(json2.wind.speed + " knots wind");
                        x = json2.coord.lat;
                        y = json2.coord.lon;
                        //console.log(x +"," +y);

                        function initialize2() {
                            var mapProp = {
                                center: new google.maps.LatLng(x, y),
                                zoom: 12,
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            };
                            var map = new google.maps.Map(document.getElementById("locationMap"), mapProp);
                            var marker = new google.maps.Marker({position: mapProp.center, map: map, title: "You are here!"});
                        }
                        initialize2();
                        //google.maps.event.addDomListener(document.getElementById("cityBtn"), 'click', initialize);
                    });
                }
            });

            //Simulate #cityBtn click if user presses enter instead of clicking on #cityBtn (quick fix :))
            $('#cityName').keypress(function(e){
              var keycode = e.keyCode || e.which;
              if(keycode== '13'){
                $('#cityBtn').click();
              }
            });

            /*Map code:
                by reading from http://www.w3schools.com/googleapi/google_maps_basic.asp;
                the marker by reading from:
                http://www.w3schools.com/html/tryit.asp?filename=tryhtml5_geolocation_map_script
                and
                https://developers.google.com/maps/documentation/javascript/markers*/
            function initialize() {
                var mapProp = {
                    center: new google.maps.LatLng(x, y),
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById("locationMap"), mapProp);
                var marker = new google.maps.Marker({position: mapProp.center, map: map, title: "You are here!"});

            }
            initialize();
            //google.maps.event.addDomListener(window, 'load', initialize);

        },
        //the optional error function
        function error() {
            if (!navigator.geolocation) {
                alert("You have denied access to your location");
            }
        },
        //the optional PositionOptions object
        {
            maximumAge: 60000,
            timeout: 50000,
            enableHighAccuracy: true
        });

    }

});
