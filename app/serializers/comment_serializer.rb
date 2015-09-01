class CommentSerializer < ActiveModel::Serializer
  attributes :id, :post_id, :body, :created_at, :nickname
end
