//comment
var kpa = {
    api: "",
    init: function(){
        kpa.api = parent.frames['webAlive'].document.getElementById("CWebPluginControl");
        if (!(kpa.api)){
            setTimeout(function () {kpa.init();}, 4000);
        }
    },
    game: {
        status: "",
        startTime: "",
        duration: "",
        scores: "",
        returnLocation: "",
        timeRemaining: "",
        players: {},
    },
    updateGameParams: function(){
        $.get("/games/1.json", function(data) {
            kpa.game.status = data.status;
            kpa.game.startTime = data.start_time;
            kpa.game.duration = data.duration;
            kpa.game.scores = new Array();
            kpa.game.scores[1] = data.team_1_score;
            kpa.game.scores[2] = data.team_2_score;
            kpa.game.returnLocation = data.return_location;
            var diffMilli = (new Date(kpa.game.startTime).addMinutes(kpa.game.duration)-(new Date((new Date).toISOString())));
            if (diffMilli > 0){
                kpa.game.timeRemaining = (Date.parse("today")).addMilliseconds(diffMilli).toString("HH:mm:ss");
            }
            else {
                kpa.game.timeRemaining = "00:00:00"
            }
        });
        $.get("/games/1/players.json", function(data) {
            kpa.game.players = data;
        });
        $("#team1list").empty();
        $("#team2list").empty();
        $.each(kpa.game.players, function(){
            if(this.team == 1){
                $("#team1list").append("<li><i class='icon-user'></i>" + this.player_id + "</li>");
            } 
            else {
                $("#team2list").append("<li><i class='icon-user'></i>" + this.player_id + "</li>");
            }
        });
        if (kpa.game.status === "started"){
            if (kpa.game.timeRemaining === "00:00:00"){
                kpa.stopGame();
            }
            kpa.renderGame();
            $(".ingame").show();
            $(".pregame").hide();
        }
        else{
            $(".ingame").hide();
            $(".pregame").show();  
        }
        $(".team").each(function(){
            $(this).css("margin-top", $(".wa-client").height()/2 + 50 - $(this).height()/2);
        });
        setTimeout(function (){kpa.updateGameParams();}, 1000);
    },
    startGame: function(duration,returnLocation){
        console.log("starting game - " + duration + " - " + returnLocation)
        $.ajax({
            type: "PUT",
            url: "/games/1",
            beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
            contentType: "application/json",
            data: JSON.stringify({game:{status: "started", team_1_score: 0, team_2_score: 0, start_time: (new Date).toISOString(), return_location: returnLocation, duration: duration}}),
            dataType: 'json'
        });
    },
    stopGame: function(){
        $.ajax({
            type: "PUT",
            url: "/games/1",
            beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
            contentType: "application/json",
            data: JSON.stringify({game:{status: "stopped"}}),
            dataType: 'json'
        });
        $(".ingame").hide();
        $(".pregame").show();
        kpa.api.wa_executeConsoleCommand("TeleportToLocation " + kpa.game.returnLocation,100);
        setTimeout(function (){kpa.api.wa_executeConsoleCommand("Do claphands", 100);},3000);
    },
    clearGame: function(){
         $.get("/clear", function(data) {});
         kpa.stopGame();    
    },
    renderGame: function(){
        $("#team1score").html( kpa.game.scores[1]);
        $("#team2score").html(kpa.game.scores[2]);
        $("#timeRemaining").html(kpa.game.timeRemaining);
    },
    lastImageUrl: ""
    
}

$(document).ready(function(){
    setTimeout(function () {kpa.init();}, 4000);
    kpa.updateGameParams();

    $("#startbtn").click(function(){
        kpa.startGame($('#duration').val(),$('#return-location').val());
        $(".pregame").hide();
        $(".ingame").show();
    });
    $("#clearbtn").click(function(){
        kpa.clearGame();
    });
    $("#stopbtn").live('click',function(){
        kpa.stopGame();
    });
    
    $("#kpa-controls-btn").click(function(){
        $(this).addClass("active");
        $("#kpa-controls").addClass("active");
        $("#zoom-controls-btn").removeClass("active");
        $("#zoom-controls").removeClass("active");
    });
    
    $("#zoom-controls-btn").click(function(){
        $(this).addClass("active");
        $("#zoom-controls").addClass("active");
        $("#kpa-controls-btn").removeClass("active");
        $("#kpa-controls").removeClass("active");
    });
    
    $("#existing-collection").click(function(){
        $("#existing-container").show();
        $("#new-container").hide();
        $("#collection-images").html("");
        $("#collection-title").removeAttr("disabled").removeClass("disabled").val("");
    });
    
    $("#new-collection").click(function(){
        $("#existing-container").hide();
        $("#new-container").show();
        $("#collection-images").html("");
    });
    
	$('#file_upload').fileupload({
      forceIframeTransport: true,    // VERY IMPORTANT.  you will get 405 Method Not Allowed if you don't add this.
      autoUpload: true,
      add: function (event, s3form) {
        if (!($("#collection-title").val())){
            alert("you must enter a collection title");
            return;
        }
        if ($("#collection-images li").size() == 10){
            alert("a collection can have at most 10 images");
            return;
        }
        $("#collection-title").attr("disabled","disabled").addClass("disabled");
        $.get("/zoom/new", {collection: {title: $("#collection-title").val()}, image: {title: s3form.files[0].name}},function(data) { 
            if(data.success){
                $('#file_upload').find('input[name=key]').val(data.s3.key);
                $('#file_upload').find('input[name=policy]').val(data.s3.policy);
                $('#file_upload').find('input[name=signature]').val(data.s3.signature);
                s3form.submit();
                kpa.lastImageUrl = data.url;
            } else {
                alert(data.message);
            }
        });
      },
      send: function(e, data) {},
      fail: function(e, data) {
        console.log('fail');
        console.log(data);
      },
      done: function (event, data) {
        $("#collection-images").append("<li><img class='thumb shadow' src='" + kpa.lastImageUrl + "'/></li>"); 
        $('#slider-code').tinycarousel();
      },
    });
    
    $("#photo-collections").change(function(){
        $("#collection-images").html("");
        if ($("#photo-collections").val()){
            $.get("/zoom/images", {name: $("#photo-collections").val()},function(data){
               if (data.success){
                   $(data.images).each(function(){
                       $("#collection-images").append("<li><img class='thumb shadow' src='" + this.full_url + "'/></li>"); 
                   });
                   $('#slider-code').tinycarousel();
               } else {
                   console.log(data);
               }
            });
        }
    });
    
    $('#slider-code').tinycarousel();
});