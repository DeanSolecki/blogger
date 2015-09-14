require 'rails_helper'

RSpec.describe Post, :type => :model do
	it "has a valid factory" do
		expect(build(:post)).to be_valid
	end

	it "fails without admin_id" do
		expect(build(:post, admin_id: nil)).not_to be_valid
	end

	it "fails without title" do
		expect(build(:post, title: nil)).not_to be_valid
	end

	it "fails without category" do
		expect(build(:post, category: nil)).not_to be_valid
	end

	it "fails with invalid category" do
		expect(build(:post, category: 'bacon')).not_to be_valid
	end

	it "fails without body" do
		expect(build(:post, body: nil)).not_to be_valid
	end

	it "works without an admin login from here" do
		expect(create(:post)).to be_valid
	end
end
