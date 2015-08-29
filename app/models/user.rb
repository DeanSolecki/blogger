class User < ActiveRecord::Base
  include DeviseTokenAuth::Concerns::User
	has_many :comments, :as => :commentable
	has_one :profile, :as => :profileable, dependent: :destroy
	validates :profile, presence: true
end
