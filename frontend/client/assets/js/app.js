(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
		'ng-token-auth',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
		
		.controller('LoginCtrl', ['$scope', '$state', '$auth', function($scope, $state, $auth) {
			$scope.LoginClick = function() {
				$auth.submitLogin($scope.loginForm);
			}
		}])

		.controller('LogoutCtrl', ['$scope', '$state', '$auth', function($scope, $state, $auth) {
			$scope.LogoutClick = function() {
				$auth.signOut();
			}
		}])

		.controller('RegCtrl', ['$scope', '$state', '$auth', function($scope, $state, $auth) {
			$scope.RegClick = function() {
				$auth.submitRegistration($scope.registrationForm);
			}
		}])

		.controller('ProfileCtrl', ['$rootScope', '$scope', '$state', '$http', function($rootScope, $scope, $state, $http) {
			if($rootScope.user.profile) {
				var data = $http.get('http://localhost:8079/api/profiles/' + $rootScope.user.profile.id);
				$scope.profileForm = $rootScope.user.profile;
			}
			else {
				$scope.profileForm = {};
			};
			
			$scope.updateProfile = function() {
				var checkedNickname = '', checkedFirst_name = '', checkedLast_name = '';

				if($scope.profileForm.nickname) {
					checkedNickname = $scope.profileForm.nickname;
				}

				if($scope.profileForm.first_name) {
					checkedFirst_name = $scope.profileForm.first_name;
				}

				if($scope.profileForm.last_name) {
					checkedLast_name = $scope.profileForm.last_name;
				}

				if(!$rootScope.user.profile) {
					var req = {
						profile: {
							nickname: checkedNickname,
							first_name: checkedFirst_name,
							last_name: checkedLast_name,
							profileable_id: $rootScope.user.id,
							profileable_type: $rootScope.user.configName
						}
					}
					$http.post('http://localhost:8079/api/profiles', req);
				}
				else {
					$http.patch('http://localhost:8079/api/profiles/' + $rootScope.user.id);
				}
			};
		}])

		.controller('HomeCtrl', ['$scope', '$state', '$auth', '$http', function($scope, $state, $auth, $http) {
			$http.get('http://localhost:8079/api/posts')
				.then(function(response) {
					$scope.data = response.data;
				});

			$scope.submitComment = function(newComment) {
				var req = {
					comment:
						{
							post_id: newComment.post_id,
							commentable_id: newComment.commentable_id,
							commentable_type: $scope.user.configName,
							body: newComment.body
						}
				}
				$http.post('http://localhost:8079/api/comments', req);
			};

			$scope.deleteComment = function(comment) {
				$http.delete('http://localhost:8079/api/comments/' + comment.id);
			};

			$scope.testBin = "this is a test: " + JSON.stringify($scope.user);
		}])

		.controller('AdminLoginCtrl', ['$scope', '$state', '$auth', function($scope, $state, $auth) {
			$scope.AdminLoginClick = function() {
				$auth.submitLogin($scope.adminLoginForm,
					{
						config: 'admin'
					}
				);
			};
		}])

		.controller('AdminLogoutCtrl', ['$scope', '$state', '$auth', function($scope, $state, $auth) {
			$scope.AdminLogoutClick = function() {
				$auth.signOut();
			};
		}])

		.controller('PostCtrl', ['$scope', '$state', '$http', function($scope, $state, $http) {
			$scope.submitPost = function() {
				var req = {
					post:
						{
							admin_id: $scope.postForm.admin_id,
							title: $scope.postForm.title,
							body: $scope.postForm.body
						}
				};

				$http.post('http://localhost:8079/api/posts', req);
			};
		}])
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$authProvider'];

  function config($urlProvider, $locationProvider, $authProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');

		$authProvider.configure([
			{
				default: {
					apiUrl: '/api'
				}
			},
			{
				admin: {
					apiUrl: '/api',
					signOutUrl: '/admin_auth/sign_out',
					emailSignInPath: '/admin_auth/sign_in',
					tokenValidationPath: '/admin_auth/validate_token'
				}
			}
		]);
  }

	run.$inject = ['$rootScope', '$auth'];

  function run($rootScope, $auth) {
    FastClick.attach(document.body);

		$rootScope.$on('LogoutClick', function() {
			$auth.signOut();
		});

		$rootScope.$on('auth:login-success', function(ev, user) {
			$rootScope.user = user;
		});
  }

})();
