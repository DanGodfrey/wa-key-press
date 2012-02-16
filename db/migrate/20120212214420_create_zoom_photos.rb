class CreateZoomPhotos < ActiveRecord::Migration
  def change
    create_table :zoom_photos do |t|
      t.integer :collection_id
      t.string :s3_key
      t.string :full_url

      t.timestamps
    end
  end
end
