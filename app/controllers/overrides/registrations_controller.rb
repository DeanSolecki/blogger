module Overrides
	class RegistrationsController < DeviseTokenAuth::RegistrationsController
		def token_validation_response
			self.as_json(except: [
				:tokens, :created_at, :updated_at
			]).merge({
				:methods => [:profile]
			})
	end
end
