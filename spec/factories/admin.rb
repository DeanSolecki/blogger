FactoryGirl.define do
	factory :admin do
		email { Faker::Internet.email }
		uid { "#{email}" }
		provider 'email'
		password '12345678'
		password_confirmation '12345678'
	end
end
