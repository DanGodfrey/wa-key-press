class AddFieldnameToPlayer < ActiveRecord::Migration
  def change
    add_column :players, :game_id, :integer
  end
end
