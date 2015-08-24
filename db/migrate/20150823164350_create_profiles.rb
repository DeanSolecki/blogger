class CreateProfiles < ActiveRecord::Migration
  def change
    create_table :profiles do |t|
      t.string :nickname
      t.string :first_name
      t.string :last_name
			t.references :profileable, polymorphic: true, index: true

      t.timestamps
    end
		
		add_index :profiles, :nickname, unique: true
  end
end
