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
        $("#team1score").html("Score: " + kpa.game.scores[1]);
        $("#team2score").html("Score: " + kpa.game.scores[2]);
        $("#timeRemaining").html("Time Remaining: " + kpa.game.timeRemaining);
    }
    
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
});