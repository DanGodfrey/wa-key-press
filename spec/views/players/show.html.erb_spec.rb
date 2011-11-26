require 'spec_helper'

describe "players/show.html.erb" do
  before(:each) do
    @player = assign(:player, stub_model(Player,
      :player_id => "Player",
      :team => 1
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Player/)
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/1/)
  end
end
