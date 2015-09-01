class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :uid, :nickname

	has_one :profile
end
