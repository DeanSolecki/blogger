class Comment < ActiveRecord::Base
	belongs_to :post
	belongs_to :commentable, :polymorphic => true
	validates :post_id, :body, :commentable_id, :commentable_type, :nickname, :post_title, presence: true

	def self.by_nickname(nickname)
		where(["nickname = :nickname", {nickname: nickname}])
	end
end
