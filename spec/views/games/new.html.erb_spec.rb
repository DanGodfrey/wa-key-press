require 'spec_helper'

describe "games/new.html.erb" do
  before(:each) do
    assign(:game, stub_model(Game,
      :status => "MyString",
      :team_1_score => 1,
      :team_2_score => 1,
      :return_location => "MyString"
    ).as_new_record)
  end

  it "renders new game form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => games_path, :method => "post" do
      assert_select "input#game_status", :name => "game[status]"
      assert_select "input#game_team_1_score", :name => "game[team_1_score]"
      assert_select "input#game_team_2_score", :name => "game[team_2_score]"
      assert_select "input#game_return_location", :name => "game[return_location]"
    end
  end
end
