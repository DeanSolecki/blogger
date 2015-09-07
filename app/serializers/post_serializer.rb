class PostSerializer < ActiveModel::Serializer
  attributes :id, :admin_id, :title, :body, :created_at, :nickname, :category
	has_many :comments
end
