require "test_helper"

class InkcontractsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @inkcontract = inkcontracts(:one)
  end

  test "should get index" do
    get inkcontracts_url, as: :json
    assert_response :success
  end

  test "should create inkcontract" do
    assert_difference("Inkcontract.count") do
      post inkcontracts_url, params: { inkcontract: { name: @inkcontract.name, state: @inkcontract.state } }, as: :json
    end

    assert_response :created
  end

  test "should show inkcontract" do
    get inkcontract_url(@inkcontract), as: :json
    assert_response :success
  end

  test "should update inkcontract" do
    patch inkcontract_url(@inkcontract), params: { inkcontract: { name: @inkcontract.name, state: @inkcontract.state } }, as: :json
    assert_response :success
  end

  test "should destroy inkcontract" do
    assert_difference("Inkcontract.count", -1) do
      delete inkcontract_url(@inkcontract), as: :json
    end

    assert_response :no_content
  end
end
