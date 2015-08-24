class Post < ActiveRecord::Base
	validates :title, :body, :admin_id, presence:true
	has_many :comments
end
