require 'spec_helper'

describe "players/index.html.erb" do
  before(:each) do
    assign(:players, [
      stub_model(Player,
        :player_id => "Player",
        :team => 1
      ),
      stub_model(Player,
        :player_id => "Player",
        :team => 1
      )
    ])
  end

  it "renders a list of players" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Player".to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => 1.to_s, :count => 2
  end
end
