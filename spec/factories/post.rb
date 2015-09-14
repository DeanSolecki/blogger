FactoryGirl.define do
	factory :post do
		title { Faker::Lorem.sentence }
		body { Faker::Lorem.paragraphs }
		nickname { Faker::Internet.user_name }
		admin_id 1
		category 'Development'
	end
end
