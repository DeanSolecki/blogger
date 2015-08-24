class Admin < ActiveRecord::Base
	devise :database_authenticatable, :recoverable,
				 :trackable, :validatable, :confirmable

  include DeviseTokenAuth::Concerns::User

	has_many :posts
	has_many :comments, :as => :commentable
	has_one :profile, :as => :profileable, dependent: :destroy
end
