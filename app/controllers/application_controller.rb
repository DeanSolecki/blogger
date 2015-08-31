class ApplicationController < ActionController::API
	before_action :set_default_response_format

	include DeviseTokenAuth::Concerns::SetUserByToken
	include ActionController::ImplicitRender
	include ActionController::Serialization

	private

	def set_default_response_format
		request.format = :json
	end
end
