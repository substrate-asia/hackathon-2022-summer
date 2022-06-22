class InkcontractsController < ApplicationController
  before_action :set_inkcontract, only: %i[ show update destroy download ]

  # GET /inkcontracts
  def index
    @inkcontracts = Inkcontract.all

    render json: @inkcontracts
  end

  # GET /inkcontracts/1
  def show
    render json: @inkcontract
  end

  # POST /inkcontracts
  def create

    params = {
      name: inkcontract_params[:file].original_filename.split('.').first,
      state: 'auditing'
    }

    @inkcontract = Inkcontract.new(params)
    @inkcontract.file.attach(inkcontract_params[:file])

    if @inkcontract.save && @inkcontract.file.attached?
      render json: @inkcontract, status: :created, location: @inkcontract
    else
      render json: @inkcontract.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /inkcontracts/1
  def update
    if @inkcontract.update({ state: "done" })
      render json: @inkcontract
    else
      render json: @inkcontract.errors, status: :unprocessable_entity
    end
  end

  # DELETE /inkcontracts/1
  def destroy
    @inkcontract.destroy
  end

  def download
    @inkcontract.file.download
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_inkcontract
      @inkcontract = Inkcontract.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def inkcontract_params
      params.permit!
    end
end
