var kpa = {
    api: "",
    init: function(){
        kpa.api = parent.frames['webAlive'].document.getElementById("CWebPluginControl");
        if (!(kpa.api)){
            setTimeout(function () {kpa.init();}, 4000);
        }
    },
    player: {
        team: 0,
        lastKey: -1
    },
    game: {
        status: "",
        startTime: "",
        duration: "",
        scores: "",
        returnLocation: "",
        timeRemaining: ""
    },
    joinTeam: function(team_number, player_id){
        if (kpa.player.team == 0) {
            kpa.player.team = team_number;
            $.post("/games/1/players", { player: {player_id: player_id, team: kpa.player.team, game_id: 1} }, function(data) {});
            $("#yourteam").html("You're on team " + team_number + " !");
        }
        return kpa.player.team;
    },
    updateGameParams: function(){
        $.get("/games/1.json", function(data) {
            if ((kpa.game.status === "started") && (data.status === "stopped")){
                $(".ingame").hide();
                kpa.api.wa_executeConsoleCommand("TeleportToLocation " + kpa.game.returnLocation,100);
                setTimeout(function (){kpa.api.wa_executeConsoleCommand("Do claphands", 100);},3000);
                kpa.api.wa_executeConsoleCommand("ToggleRunByDefault",100); 
                kpa.player.team = 0;
                $("#yourteam").html("");
            }
            else  if ((kpa.game.status === "stopped") && (data.status === "started")){
                kpa.api.wa_executeConsoleCommand("ToggleRunByDefault",100); 
            }
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
        if (kpa.game.status == "started"){
            kpa.renderGame();
        }
        $(".team").each(function(){
            $(this).css("margin-top", $(".wa-client").height()/2 + 50 - $(this).height()/2);
        });
        setTimeout(function (){kpa.updateGameParams();}, 1000);
    },
    pressKey: function(keyNumber,keyTeam){
        if (kpa.game.status == "stopped"){
            kpa.api.wa_executeConsoleCommand("displayHUDMessage THE GAME HASN'T STARTED YET!",100);
            return;
        }
        if (kpa.player.team != keyTeam){
            kpa.api.wa_executeConsoleCommand("displayHUDMessage THIS KEY DOES NOT BELONG TO YOUR TEAM",100);
            return;
        }
        if ((kpa.game.scores[kpa.player.team] + 1) != keyNumber){
            kpa.api.wa_executeConsoleCommand("displayHUDMessage THIS IS NOT THE NEXT KEY. THE NEXT KEY IS " + (kpa.game.scores[kpa.player.team] + 1),100);
            return;
        }
        if ((parseInt(kpa.player.lastKey) + 1) == keyNumber){
            kpa.api.wa_executeConsoleCommand("displayHUDMessage YOU CAN'T PUSH TWO KEYS IN A ROW.",100);
            return;
        }
        //TODO:
        //call web alive trigger to remove key here
        kpa.player.lastKey = keyNumber;
        var dataString;
        if (kpa.player.team == 1){
            dataString = JSON.stringify({game:{team_1_score: keyNumber}});
        }
        else{
            dataString = JSON.stringify({game:{team_2_score: keyNumber}});
        }
        $.ajax({
            type: "PUT",
            url: "/games/1",
            beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
            contentType: "application/json",
            data: dataString,
            dataType: 'json'
        });
        kpa.api.wa_executeConsoleCommand("displayHUDMessage YOU SUCCESSFULLY PRESSED KEY " + keyNumber,100);
    },
    renderGame: function(){
        $(".ingame").show();
        $("#team1score").html(kpa.game.scores[1]);
        $("#team2score").html(kpa.game.scores[2]);
        $("#timeRemaining").html( kpa.game.timeRemaining);
    }
}

function joinTeamFromWA(parameters, pawnSessionId, pawnName){
    kpa.joinTeam(parameters,pawnName);
}

function pressKeyFromWA(parameters){
    kpa.pressKey(parameters.split(" ")[0],parameters.split(" ")[1]);
}

$(document).ready(function(){
    $(".ingame").hide();
    setTimeout(function () {kpa.init();}, 4000);
    kpa.updateGameParams();
    $("#join1").click(function(){
        kpa.joinTeam(1,$("#name").val());
        $("#join2").addClass("disabled");
        $("#join1").addClass("disabled");
    });
    $("#join2").click(function(){
        kpa.joinTeam(2,$("#name").val());
        $("#join2").addClass("disabled");
        $("#join1").addClass("disabled");
    });
    $("#pressbtn").click(function(){
        kpa.pressKey($("#key").val(),kpa.player.team);
    });
});
//move these to application.js later

