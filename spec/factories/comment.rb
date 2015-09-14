FactoryGirl.define do
	factory :comment do
		association :post
		post_title { Faker::Lorem::sentence }
		nickname { Faker::Internet.user_name }
		commentable_id 1
		commentable_type 'user'
		body { Faker::Lorem::paragraphs }
	end
end
