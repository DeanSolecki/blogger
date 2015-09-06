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
					$scope.posts = response.data.posts;
					$scope.postsCount = $scope.posts[$scope.posts.length - 1].id;
					$scope.showEditBox = Create2DArray($scope.postsCount + 1);
					$scope.showEditPostBox = [];
					$scope.showCommentBox = [];
				});

			$scope.fireEditBox = function(comment) {
				$scope.showEditBox[comment.post_id][comment.id] = 1;
				$scope.testBin = $scope.showEditBox[comment.post_id][comment.id];
			}
			
			$scope.fireEditPostBox = function(id) {
				$scope.showEditPostBox[id] = 1;
			}

			$scope.fireCommentBox = function(id) {
				$scope.showCommentBox[id] = 1;
			};

			$scope.updatePost = function(post) {
				var req = {
					post: {
						post_id: post.id,
						admin_id: $scope.user.id,
						nickname: $scope.user.profile.nickname,
						title: post.title,
						body: post.body
					}
				};

				$http.patch('http://localhost:8079/api/posts/' + post.id, req);
			};

			$scope.deletePost = function(id) {
				$http.delete('http://localhost:8079/api/posts/' + id);
			};

			$scope.submitComment = function(post) {
				var req = {
					comment:
						{
							post_id: post.id,
							commentable_id: $scope.user.id,
							commentable_type: $scope.user.configName,
							nickname: $scope.user.profile.nickname,
							body: post.newComment
						}
				}
				$http.post('http://localhost:8079/api/comments', req);
			};

			$scope.deleteComment = function(comment) {
				$http.delete('http://localhost:8079/api/comments/' + comment.id);
			};

			$scope.updateComment = function(comment) {
				var req = {
					comment:
					{
						post_id: comment.post_id,
						commentable_id: comment.commentable_id,
						commentable_type: comment.commentable_type,
						nickname: comment.nickname,
						body: comment.body
					}
				};

				$http.patch('http://localhost:8079/api/comments/' + comment.id, req);
			};

			function Create2DArray(rows) {
				var arr = [];

				for (var i=0;i<rows;i++) {
					arr[i] = [];
				}

				return arr;
			};
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
