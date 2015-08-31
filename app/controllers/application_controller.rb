class ApplicationController < ActionController::API
	before_action :set_default_response_format

	include DeviseTokenAuth::Concerns::SetUserByToken
	include ActionController::ImplicitRender
	include ActionController::Serialization

	protected

	def configure_permitted_parameters
		devise_parameter_sanitizer.for(:sign_up) {|u| u.permit(:profile)}
	end

	private

	def set_default_response_format
		request.format = :json
	end
end
