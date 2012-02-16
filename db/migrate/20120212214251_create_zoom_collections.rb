class CreateZoomCollections < ActiveRecord::Migration
  def change
    create_table :zoom_collections do |t|
      t.string :name

      t.timestamps
    end
  end
end
