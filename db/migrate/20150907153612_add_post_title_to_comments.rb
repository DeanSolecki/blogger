class AddPostTitleToComments < ActiveRecord::Migration
  def change
    add_column :comments, :post_title, :string
  end
end
