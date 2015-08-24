class CommentSerializer < ActiveModel::Serializer
  attributes :id, :post_id, :body, :commentable_id, :commentable_type
end
