class PostSerializer < ActiveModel::Serializer
  attributes :id, :admin_id, :title, :body
	has_many :comments
end
