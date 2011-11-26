require 'spec_helper'

describe "players/new.html.erb" do
  before(:each) do
    assign(:player, stub_model(Player,
      :player_id => "MyString",
      :team => 1
    ).as_new_record)
  end

  it "renders new player form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => players_path, :method => "post" do
      assert_select "input#player_player_id", :name => "player[player_id]"
      assert_select "input#player_team", :name => "player[team]"
    end
  end
end
