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

    giphyJax: function() {

    },

    weatherJax: function() {
        var query_param1 = "Santa Monica";
        var appID2 = "ad2a32bbb65b8db270ee6f7c72514b20";
        var queryURL2 = "http://api.openweathermap.org/data/2.5/weather?q=" + query_param1 + "&APPID=" + appID2;
        console.log(this.topics[3]);
        

        $.ajax({
            url: queryURL2,
            method: 'GET'
        }).done(function(response) {
            console.log("Weather");
            console.log(response);
        });


    },

    buttonGenerator: function() {
        $('#buttonGroup').empty();
        for (i = 0; i < this.topics.length; i++) {
            var bttn = $('<button />', {
                "class": 'abstract btn waves-effect blue',
                "data-value": this.topics[i].replace(" ", "+"),
                text: this.topics[i]
            });
            $('#buttonGroup').append(bttn);

        }
    }


};



gifMachine.buttonGenerator();


$(document).ready(function() {
    Materialize.updateTextFields();
    gifMachine.buttonGenerator();

});





$(document).on("click", ".abstract", function() {
    $(".gifGuts").empty();
    $(".abstract").removeClass("active");

    $(this).addClass("active");

    var appID = "dc6zaTOxFJmzC" + "&limit=10"; // public

    var query_param = $(this).attr("data-value");

    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + query_param + "&api_key=" + appID;
    $(".abstract").removeClass("active");


    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .done(function(response) {
            var returns = response.data;



            for (var i = 0; i < returns.length; i++) {
                var abstractDiv = $("<div class=\"abstract-item col s6 m4 l2\">");

                var rating = returns[i].rating;


                var animation = returns[i].images.fixed_height.url;
                var still = returns[i].images.fixed_height_still.url;
                var p = $("<div class='chip pink accent-1'>").text("Rating: " + rating);


                var abstractImage = $("<img>", {
                    'src': still,
                    'data-still': still,
                    'data-animate': animation,
                    'data-state': "still",
                    'class': "abstract-image"

                });

                abstractDiv.append(p);
                abstractDiv.append(abstractImage);

                $(".gifGuts").append(abstractDiv);
                
            }
        });
});

$(document).on("click", ".abstract-image", function() {
    var state = $(this).attr("data-state");

    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }


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
   
$("button-fav").on("click", function(event) {
    event.preventDefault();
    var newTopic = $("button").eq(0).val();

    if (newTopic.length > 2) {
        gifMachine.topics.push(newTopic);
        $("sendGet2").val('');
        removeClass.buttonGenerator();
    }



 
 
