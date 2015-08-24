class Profile < ActiveRecord::Base
	belongs_to :profileable, :polymorphic => true
	validates :profileable_id, :profileable_type, presence: true
end
