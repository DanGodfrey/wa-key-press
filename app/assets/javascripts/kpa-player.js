var kpa = {
    api: "",
    init: function(){
        this.api = parent.frames['webAlive'].document.getElementById("CWebPluginControl");
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
        returnLocation: ""
    },
    joinTeam: function(team_number, player_id){
        if (this.team == 0) {
            this.team = team_number;
            $.post("/games/1/players", { player: {player_id: player_id, team: this.team, game_id: 1} }, function(data) {});
        }
        return this.team;
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
        });
        setTimeout(function () {kpa.init();kpa.updateGameParams();}, 1000);
    },
    pressKey: function(player,keyNumber,keyTeam){
        if (this.game.status === "stopped"){
            api.wa_executeConsoleCommand("displayHUDMessage THE GAME HASN'T STARTED YET!");
            return;
        }
        if (this.player.team !== keyTeam){
            api.wa_executeConsoleCommand("displayHUDMessage THIS KEY DOES NOT BELONG TO YOUR TEAM");
            return;
        }
        if ((this.game.scores[this.player.team] + 1) !== keyNumber){
            api.wa_executeConsoleCommand("displayHUDMessage THIS IS NOT THE NEXT KEY. THE NEXT KEY IS " + (this.game.scores[this.player.team] + 1));
            return;
        }
        if ((this.player.lastKey + 1) === keyNumber){
            api.wa_executeConsoleCommand("displayHUDMessage YOU CAN'T PUSH TWO KEYS IN A ROW.");
            return;
        }
        //call web alive trigger to remove key
        this.api.wa_executeConsoleCommand("displayHUDMessage YOU SUCCESSFULLY PRESSED KEY " + keyNumber);
    }
}


//move these to application.js later

