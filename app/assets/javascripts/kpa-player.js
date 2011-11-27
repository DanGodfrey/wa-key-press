var kpa = {
    api: "",
    init: function(){
        this.api = parent.frames['webAlive'].document.getElementById("CWebPluginControl");
        if (!(this.api)){
            setTimeout(function () {kpa.init();}, 4000);
        }
    },
    player: {
        team: 0,
        lastKey: 0
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
        if (kpa.player.team === 0) {
            kpa.player.team = team_number;
            $.post("/games/1/players", { player: {player_id: player_id, team: kpa.player.team, game_id: 1} }, function(data) {});
        }
        return this.player.team;
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
            var diffMilli = (new Date(kpa.game.startTime).addMinutes(kpa.game.duration)-(new Date));
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
        else{
            $("#ingame").hide();
        }
        setTimeout(function (){kpa.updateGameParams();}, 1000);
    },
    pressKey: function(player,keyNumber,keyTeam){
        if (this.game.status === "stopped"){
            this.api.wa_executeConsoleCommand("displayHUDMessage THE GAME HASN'T STARTED YET!",100);
            return;
        }
        if (this.player.team !== keyTeam){
            this,api.wa_executeConsoleCommand("displayHUDMessage THIS KEY DOES NOT BELONG TO YOUR TEAM",100);
            return;
        }
        if ((this.game.scores[this.player.team] + 1) !== keyNumber){
            this.api.wa_executeConsoleCommand("displayHUDMessage THIS IS NOT THE NEXT KEY. THE NEXT KEY IS " + (this.game.scores[this.player.team] + 1),100);
            return;
        }
        if ((this.player.lastKey + 1) === keyNumber){
            this,api.wa_executeConsoleCommand("displayHUDMessage YOU CAN'T PUSH TWO KEYS IN A ROW.",100);
            return;
        }
        //TODO:
        //call web alive trigger to remove key here
        this.api.wa_executeConsoleCommand("displayHUDMessage YOU SUCCESSFULLY PRESSED KEY " + keyNumber,100);
    },
    renderGame: function(){
        $("#team1score").html(kpa.game.scores[1]);
        $("#team2score").html(kpa.game.scores[2]);
        $("#timeRemaining").html(kpa.game.timeRemaining);
    }
}

setTimeout(function () {kpa.init();}, 4000);
kpa.updateGameParams();
$("#ingame").hide();
//move these to application.js later

