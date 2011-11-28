class WaController < ApplicationController 
  def index
  end
  
  def facilitator
  end
  
  def clear
     @game = Game.find(1)
     @game.status = "stopped"
     @game.start_time =  Time.now
     @game.duration = 0
     @game.team_1_score = 0
     @game.team_2_score = 0
     @game.return_location = ""
     @game.players.each do |player|
          player.destroy
     end
     @game.save
     redirect_to game_path(@game)
  end
end