class CreatePlayers < ActiveRecord::Migration
  def change
    create_table :players do |t|
      t.string :player_id
      t.integer :team

      t.timestamps
    end
  end
end
