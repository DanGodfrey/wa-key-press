# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120212214420) do

  create_table "games", :force => true do |t|
    t.string   "status"
    t.datetime "start_time"
    t.integer  "duration"
    t.integer  "team_1_score"
    t.integer  "team_2_score"
    t.string   "return_location"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "players", :force => true do |t|
    t.string   "player_id"
    t.integer  "team"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "game_id"
  end

  create_table "zoom_collections", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "zoom_photos", :force => true do |t|
    t.integer  "collection_id"
    t.string   "s3_key"
    t.string   "full_url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
