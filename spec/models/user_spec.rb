require 'rails_helper'

RSpec.describe User, :type => :model do
	it "has a valid factory" do
		expect(build(:user)).to be_valid
	end

	it "fails without email" do
		expect(build(:user, email: nil)).not_to be_valid
	end

	it "fails without password" do
		expect(build(:user, password: nil)).not_to be_valid
	end
end
