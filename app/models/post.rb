class Post < ActiveRecord::Base
	validates :title, :body, :admin_id, :nickname, presence:true
	has_many :comments
end
