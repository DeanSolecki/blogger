FactoryGirl.define do
	factory :profile do
		nickname Faker::Internet.user_name
		first_name Faker::Name.first_name
		last_name Faker::Name.last_name

		trait :user do
			association :user, factory: :user
		end

		trait :admin do
			association :admin, factory: :admin
		end
	end
end
