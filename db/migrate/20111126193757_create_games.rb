class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :status
      t.timestamp :start_time
      t.integer :duration
      t.integer :team_1_score
      t.integer :team_2_score
      t.string :return_location

      t.timestamps
    end
  end
end
