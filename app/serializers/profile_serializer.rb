class ProfileSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :first_name, :last_name
end
