$(".navbar-toggler").on("click", function(){

    console.log($("#navbarToggleExternalContent").css("display"));
    
    if($("#navbarToggleExternalContent").css("display") === "none"){
        $("#navbarToggleExternalContent").css("display", "unset");
    }
    else if($("#navbarToggleExternalContent").css("display") === "unset") {
        $("#navbarToggleExternalContent").css("display", "none");
    }
})

var map;
var infowindow;

function initMap() {
  var pyrmont = {lat: 40.7309, lng: -74.065};

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: pyrmont,
    radius: 16094,
    name: ["McDonald"]
  }, callback);
}

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

var gifMachine = {
    topics: ['mcdonalds',
        'burger king',
        'in-and-out burger',
        'wendys',
        'yoshinoya',
        'arbys',
        'olive garden',
        'china chef',
        'papa johns',
        'outback'
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

gifMachine.buttonGenerator();

$(document).ready(function() {
    gifMachine.buttonGenerator();
});

$(document).on("click", "#submitSearch", function(e){
    e.preventDefault();

    var param = "";

    $("restaurantList").empty();

    var city = $("#city").val();
    console.log(city);

    var userKey = "23c62f98e8626382f65fe3b8fb2ba93f";

    var query = "https://developers.zomato.com/api/v2.1/locations?apikey=23c62f98e8626382f65fe3b8fb2ba93f&query="+city;
    console.log(query);

    $.ajax({
        url: query,
        method: "GET"
    }).then(function(response){
        console.log(response);
        var entityID;
        var entityType;
        for(var i=0; i<response.location_suggestions.length; i++){
            console.log(response.location_suggestions);
            // console.log(response.location_suggestions[0].city_id);
            entityID = response.location_suggestions[0].entity_id;
            entityType = response.location_suggestions[0].entity_type;
        }
        console.log("ID: "+entityID);
        console.log("Type: "+entityType);
        
        var entity = "entity_id="+entityID;
        var entityTy = "&entity_type="+entityType;
        
        var queryDetail = "https://developers.zomato.com/api/v2.1/location_details?apikey=23c62f98e8626382f65fe3b8fb2ba93f&"+entity+entityTy;
        console.log(queryDetail);

        $.ajax({
            url: queryDetail,
            method: "GET"
        }).then(function(result){
            console.log(result);
            for(var j=0; j<result.best_rated_restaurant.length; j++){
                console.log(result.best_rated_restaurant[j]);

                var itemDiv = $("<div class= card search-snippet-card search-card>");
                
                var itemCont = itemDiv.html("<div class= content>");

                var restName = itemCont.html("<h1 class=restName>")

                restName.append(result.best_rated_restaurant[j].restaurant.name);

                $("#restaurantList").append(itemDiv);
            }
        });
    });
});

$(document).on("click", ".abstract", function() {

     initMap();

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.7309, lng: -74.065},
          zoom: 15
        });
       

        //HTML5 geolocation.
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            // This defines the local storage variables 
            localStorage.setItem("userLat", position.coords.latitude);
            localStorage.setItem("userLong", position.coords.longitude);
            
            // These are the variables we will use for Latitude and Longitude.
            console.log("This is user Latitude", localStorage.getItem("userLat"))
            console.log("This is user Longitude", localStorage.getItem("userLong"))}
        )}};

    
    // $(".gifs").empty();
    // var foodPlace = $(this).attr("data-value").trim();
    // console.log(foodPlace);

    // var queryURL = "https://nutritionix-api.p.mashape.com/v1_1/search/"+foodPlace;
    // console.log(queryURL);

    // $.ajax({
    //         url: queryURL,
    //         method: "GET",
    //         headers:{
    //             "X-Mashape-Key": "LRVp30TNDXmsh6Qjeevv3raWCHJVp1pSl8cjsn9AoUPUBQz53X",
    //             "Accept": "application/json"
    //         },
    //         dataType: "json",
    //         success: function(data){
    //             console.log("success: "+ data);
    //         }
    //     })
    //     .then(function(response) {
    //         console.log(response);
            
    //     });

    // var uberURL = "https://sandbox-api.uber.com/v1.2/products?server_token=Hrad593eWCUzLo8y-EBJNke44sNV2hY-SI4CsbEK&latitude=40.730610&longitude=-73.935242";
    // $.ajax({
    //     url: uberURL,
    //     method: "GET"
    // }).then(function(uberResponse){
    //     console.log(uberResponse);
    // })
    
});

$("#sendGet").on("click", function(event) {
    event.preventDefault();
    var newTopic = $("#icon_prefix2").eq(0).val();

    if (newTopic.length > 2) {
        gifMachine.topics.push(newTopic);
        $("#icon_prefix2").val('');
        gifMachine.buttonGenerator();
    }
});
