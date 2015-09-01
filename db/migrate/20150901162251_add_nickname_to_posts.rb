class AddNicknameToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :nickname, :string
  end
end
