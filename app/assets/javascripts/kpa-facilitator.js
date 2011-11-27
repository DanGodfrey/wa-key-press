var kpa = {
    api: "",
    init: function(){
        this.api = parent.frames['webAlive'].document.getElementById("CWebPluginControl");
        if (!(this.api)){
            setTimeout(function () {kpa.init();}, 4000);
        }
    },
    startGame: function(){

    },
    stopGame: function(){
        
    },
    clearGame: function(){
        
    }
    
}
setTimeout(function () {kpa.init();}, 4000);