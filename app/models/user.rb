class User < ActiveRecord::Base
  include DeviseTokenAuth::Concerns::User
	has_many :comments, :as => :commentable
	has_one :profile, :as => :profileable, dependent: :destroy, autosave: true
	accepts_nested_attributes_for :profile
	
	module DeviseTokenAuth::Concerns::User
		extend ActiveSupport::Concern

		def token_validation_response
			UserSerializer.new(self, root: false)

			all the shit should get fucked here
		end
	end
end
