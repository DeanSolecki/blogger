class Post < ActiveRecord::Base
	validates :title, :body, :admin_id, :nickname, presence:true
	validates :category, inclusion: { in: ["Life and Times of Dean S.", "Development", "Style"] }
	has_many :comments
end
