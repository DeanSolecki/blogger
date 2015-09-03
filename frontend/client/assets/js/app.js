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
			$scope.profileForm = {};

			if($rootScope.user) {
				$scope.profileForm = $rootScope.user.profile;
			};
			
			$scope.updateProfile = function() {
				if($rootScope.user) {
					var req = {};
					req.profile = $scope.profileForm;

					$http.patch('http://localhost:8079/api/profiles/' + $rootScope.user.profile.id, req);
				};
			};

		}])

		.controller('HomeCtrl', ['$rootScope', '$scope', '$state', '$auth', '$http',
				function($rootScope, $scope, $state, $auth, $http) {
			$http.get('http://localhost:8079/api/posts')
				.then(function(response) {
					$scope.data = response.data;
				});

			$scope.showCommentBox = {};
			
			$scope.fireCommentBox = function(id) {
				$scope.showCommentBox.id = true;
			};

			$scope.submitComment = function(newComment) {
				var req = {
					comment:
						{
							post_id: newComment.post_id,
							commentable_id: $scope.user.id,
							commentable_type: $scope.user.configName,
							nickname: $rootScope.user.profile.nickname,
							body: newComment.body
						}
				}
				$http.post('http://localhost:8079/api/comments', req);
			};

			$scope.deleteComment = function(comment) {
				$http.delete('http://localhost:8079/api/comments/' + comment.id);
			};

			$scope.testBin = "this is is here for testing: " + JSON.stringify($scope.user);
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

		.controller('PostCtrl', ['$rootScope', '$scope', '$state', '$http', function($rootScope, $scope, $state, $http) {
			$scope.submitPost = function() {
				var req = {
					post:
						{
							admin_id: $scope.postForm.admin_id,
							title: $scope.postForm.title,
							nickname: $rootScope.user.profile.nickname,
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

  }

})();
