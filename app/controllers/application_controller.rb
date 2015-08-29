class ApplicationController < ActionController::API
	before_action :set_default_response_format
	before_action :configure_permitted_parameters, if: :devise_controller?

	include DeviseTokenAuth::Concerns::SetUserByToken
	include ActionController::MimeResponds
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
