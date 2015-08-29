class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :uid 

	has_one :profile
end
