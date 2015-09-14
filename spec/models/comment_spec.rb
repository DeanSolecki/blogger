require 'rails_helper'

RSpec.describe Comment, :type => :post do
	it "has a valid factory" do
		expect(build(:comment)).to be_valid
	end

	it "is not valid without post_id" do
		expect(build(:comment, post_id: nil)).not_to be_valid
	end

	it "is not valid without post_title" do
		expect(build(:comment, post_title: nil)).not_to be_valid
	end
	
	it "is not valid without commentable_id" do
		expect(build(:comment, commentable_id: nil)).not_to be_valid
	end

	it "is not valid without commentable_type" do
		expect(build(:comment, commentable_type: nil)).not_to be_valid
	end

	it "is not valid without nickname" do
		expect(build(:comment, nickname: nil)).not_to be_valid
	end

	it "is not valid without body" do
		expect(build(:comment, body: nil)).not_to be_valid
	end
end
