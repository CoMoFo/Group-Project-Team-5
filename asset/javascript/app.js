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
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.730610, lng: -73.935242},
    zoom: 8
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
    $(".gifs").empty();
    var foodPlace = $(this).attr("data-value").trim();
    console.log(foodPlace);

    var queryURL = "https://nutritionix-api.p.mashape.com/v1_1/search/"+foodPlace;
    console.log(queryURL);

    $.ajax({
            url: queryURL,
            method: "GET",
            headers:{
                "X-Mashape-Key": "LRVp30TNDXmsh6Qjeevv3raWCHJVp1pSl8cjsn9AoUPUBQz53X",
                "Accept": "application/json"
            },
            dataType: "json",
            success: function(data){
                console.log("success: "+ data);
            }
        })
        .then(function(response) {
            console.log(response);
            
        });
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
