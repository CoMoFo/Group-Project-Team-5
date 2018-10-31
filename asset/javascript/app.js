//****************************************************//
//****************************************************//

//*************** Google GeoLocation API which ask user to know the current latitude and longitude *************//

function initMapCord(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            // This defines the local storage variables 
            localStorage.setItem("userLat", position.coords.latitude);
            localStorage.setItem("userLong", position.coords.longitude);
            
            // These are the variables we will use for Latitude and Longitude.
            console.log("This is user Latitude", localStorage.getItem("userLat"))
            console.log("This is user Longitude", localStorage.getItem("userLong"))
          }
        )}
}

//****************** Code is run from here once the document is ready and loaded ******************//

$(document).ready(function() {

//********************** Object to hold the favorite restaurant or food chains ******************************//
var restaurantButton = {
    topics: ['mcdonalds',
            'burger king',
            'wendys',
            'arbys',
            'olive garden',
            'papa johns',
        ],

        buttonGenerator: function() {
            $('#buttonGroup').empty();
            for (i = 0; i < this.topics.length; i++) {
                var bttn = $('<button />', {
                    "class": 'abstract btn waves-effect',
                    "data-value": this.topics[i],
                    text: this.topics[i]
                });
                $('#buttonGroup').append(bttn);
                
            }
        }
    };
    
    restaurantButton.buttonGenerator();
    
    localStorage.setItem("restaurants", restaurantButton.topics);

    //********* On click of submit Ajax call to Zomato API to get restaurant details *************//

    $(document).on("click", "#submitSearch", function(e){
        e.preventDefault();

        $(".menu-display").empty();

        var city = $("#location").val();
        var currentLat = localStorage.getItem("userLat");
        var currentLong = localStorage.getItem("userLong");

        var query = "https://developers.zomato.com/api/v2.1/locations?apikey=23c62f98e8626382f65fe3b8fb2ba93f&query="+city;
        console.log(query);

        $.ajax({
            url: query,
            method: "GET"
        }).then(function(result){
            console.log(result);

            var searchCity;
            var searchLat;
            var searchLong;

            searchCity = result.location_suggestions[0].city_name;
            searchLat = result.location_suggestions[0].latitude;
            searchLong = result.location_suggestions[0].longitude;

            console.log(searchCity);
            console.log(searchLat);
            console.log(searchLong);

            // var entityID;
            // // var entityType;
            // for(var i=0; i<result.location_suggestions.length; i++){
            //     console.log(result.location_suggestions);
            //     // console.log(result.location_suggestions[0].city_id);
            //     entityID = result.location_suggestions[0].entity_id;
            //     entityType = result.location_suggestions[0].entity_type;
            //  }
            // console.log("ID: "+entityID);
            // console.log("Type: "+entityType);
            
            // var entity = "entity_id="+entityID;
            // var entityTy = "&entity_type="+entityType;
            
            var queryDetail = "https://developers.zomato.com/api/v2.1/geocode?apikey=23c62f98e8626382f65fe3b8fb2ba93f"+"&lat="+searchLat+"&lon="+searchLong;
            console.log(queryDetail);

            $.ajax({
                url: queryDetail,
                method: "GET"
            }).then(function(result){
                console.log(result);
                for(var j=0; j<result.nearby_restaurants.length; j++){
                    console.log(result.nearby_restaurants[j]);

                    var itemDiv = $("<div class= card search-snippet-card search-card>");
                    
                    var itemCont = $("<div class= content>");
                    
                    var restName = $("<h1 class=restName>");
                    restName.text(result.nearby_restaurants[j].restaurant.name);
                    itemCont.append(restName);
                    
                    var restAddress = $("<h2 class = restAddress>");
                    restAddress.prepend(result.nearby_restaurants[j].restaurant.location.address);
                    itemCont.append(restAddress);
                    
                    var url = result.nearby_restaurants[j].restaurant.menu_url;
                    var restUrl = $("<a href="+'"'+url+'"'+"><h3>Click to see Menu</h3></a>");
                    itemCont.append(restUrl);
                    // restUrl.append(result.nearby_restaurants[j].restaurant.menu_url);
                    
                    itemDiv.append(itemCont);
                    $(".menu-display").append(itemDiv);
                }
            });
        });
    });

    //************* On click function of buttons on my Favorite page ******************//
    $(document).on("click", ".abstract", function() {

        var favRestaurant = $(this).attr("data-value");
        console.log("my fav place: "+favRestaurant);

        //************** Googl GeoLocation API to display specfic places in 10 miles radius of current location ***********/
        var map;
        var infowindow;

        initMap();

        function initMap() {
            
            lat = localStorage.getItem("userLat");
            long = localStorage.getItem("userLong");
            var currentLocation = new google.maps.LatLng(lat, long);
            
            map = new google.maps.Map(document.getElementById('map'), {
                center: currentLocation,
                zoom: 12
            });

            
            console.log("my fav place: "+favRestaurant);
            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: currentLocation,
                radius: 16094,
                name: [favRestaurant]
            }, callback);
        };

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
        }
        
        function createMarker(place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
            });
        }
        
    });

    $("#sendGet").on("click", function(event) {
        // event.preventDefault();
        var newTopic = $("#addRestaurant").val().trim();
        console.log(newTopic);

        if (newTopic.length > 2) {
            restaurantButton.topics.push(newTopic);
            $("#addRestaurant").val('');
            restaurantButton.buttonGenerator();
        }
    });

});
