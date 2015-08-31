class User < ActiveRecord::Base
  include DeviseTokenAuth::Concerns::User
	has_many :comments, :as => :commentable
	has_one :profile, :as => :profileable, dependent: :destroy, autosave: true
	accepts_nested_attributes_for :profile
	
end
