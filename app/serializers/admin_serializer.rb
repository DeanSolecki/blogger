class AdminSerializer < ActiveModel::Serializer
  attributes :id, :uid, :nickname, :email
	has_one :profile
end
