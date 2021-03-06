class ProfilesController < ApplicationController
  before_action :set_profile, only: [:show, :edit, :update, :destroy]
	devise_token_auth_group :member, contains: [:user, :admin]
	before_action :authenticate_member!, :except => [:index, :show]

  respond_to :json

  def index
    @profiles = Profile.all
    respond_with(@profiles)
  end

  def show
    respond_with(@profile)
  end

  def new
    @profile = Profile.new
    respond_with(@profile)
  end

  def edit
  end

  def create
    @profile = Profile.new(profile_params)
    @profile.save
    respond_with(@profile)
  end

  def update
    @profile.update(profile_params)
    respond_with(@profile)
  end

  def destroy
    @profile.destroy
    respond_with(@profile)
  end

  private
    def set_profile
			if params[:nickname]
				@profile = Profile.find_by_nickname(params[:nickname])
			else
				@profile = Profile.find(params[:id])
			end
    end

    def profile_params
      params.require(:profile).permit(:nickname, :first_name, :last_name, :profileable_id, :profileable_type)
    end
end
