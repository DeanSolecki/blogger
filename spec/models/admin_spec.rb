require 'rails_helper'

RSpec.describe Admin, :type => :model do
	it "has a valid factory" do
		expect(build(:admin)).to be_valid
	end

	it "fails without email" do
		expect(build(:admin, email: nil)).not_to be_valid
	end

	it "fails without password" do
		expect(build(:admin, password: nil)).not_to be_valid
	end
end
