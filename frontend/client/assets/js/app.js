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
				$auth.submitLogin($scope.loginForm)
					.then(function(resp) {
						$state.go('home');
					});
				
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

		.controller('PostCtrl', ['$scope', '$state', '$http', 'passData', 'viewer',
				function($scope, $state, $http, passData, viewer) {
					$scope.post = passData.get();

					$scope.viewProfile = function(nickname) {
						viewer.go(nickname);
					};
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

		.controller('PubProfileCtrl', ['$scope', '$http', 'passData',
				function($scope, $http, passData) {
					$scope.data = passData.get();
		}])

		.controller('HomeCtrl', ['$scope', '$state', '$http', 'passData', 'viewer', 'resourcer',
				function($scope, $state, $http, passData, viewer, resourcer) {
			$http.get('http://localhost:8079/api/posts')
				.then(function(response) {
					$scope.posts = response.data.posts;
					$scope.postsHighestId = $scope.posts[$scope.posts.length - 1].id;
					$scope.showEditBox = Create2DArray($scope.postsHighestId + 1);
					$scope.postsCount = $scope.posts.length;
					$scope.showEditPostBox = [];
					$scope.showCommentBox = [];
					$scope.showDeletePostButtons = [];
					$scope.postTitles = [];
					$scope.lifeTitles = [];
					$scope.devTitles = [];
					$scope.styleTitles = [];

					for(var i = 0; i < $scope.postsCount; i++) {
						$scope.postTitles.unshift({ title: $scope.posts[i].title, id: $scope.posts[i].id });

						if($scope.posts[i].category == 'Life and Times of Dean S.') {
							$scope.lifeTitles.unshift({ title: $scope.posts[i].title, id: $scope.posts[i].id});
						}
						else if ($scope.posts[i].category == 'Development') {
							$scope.devTitles.unshift({ title: $scope.posts[i].title, id: $scope.posts[i].id});
						}
						else if ($scope.posts[i].category == 'Style') {
							$scope.styleTitles.unshift({ title: $scope.posts[i].title, id: $scope.posts[i].id});
						}
					};

				});
			
			// Presentation controls
			$scope.showNewPostForm = 0;

			$scope.fireEditBox = function(comment) {
				$scope.showEditBox[comment.post_id][comment.id] = 1;
			}
			
			$scope.fireEditPostBox = function(id) {
				$scope.showEditPostBox[id] = 1;
			}

			$scope.fireDeletePostButtons = function(id) {
				$scope.showDeletePostButtons[id] = 1;
			};

			$scope.fireCommentBox = function(id) {
				$scope.showCommentBox[id] = 1;
			};

			// Post methods
			$scope.publishPost = function(post) {
				post.admin_id = $scope.user.id;
				post.nickname = $scope.user.profile.nickname;
				resourcer.publishPost(post);
			};

			$scope.updatePost = function(post) {
				post.admin_id = $scope.user.id;
				post.nickname = $scope.user.profile.nickname;
				resourcer.updatePost(post);
			};

			$scope.deletePost = function(id) {
				resourcer.deletePost(id);
			};

			$scope.viewPost = function(id) {
				viewer.viewPost(id);
			};

			// Comment methods
			$scope.publishComment = function(post) {
				var comment = {};
				comment.commentable_id = $scope.user.id;
				comment.commentable_type = $scope.user.configName;
				comment.nickname = $scope.user.profile.nickname;
				comment.post_id = post.id;
				comment.post_title = post.title;
				comment.body = post.newComment;

				resourcer.publishComment(comment);
			};

			$scope.updateComment = function(comment) {
				resourcer.updateComment(comment);
			};

			$scope.deleteComment = function(id) {
				resourcer.deleteComment(id);
			};

			$scope.viewProfile = function(nickname) {
				viewer.go(nickname);
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

		// Factories
		.factory('passData', function() {
			var savedData = {}

			function set(data) {
				savedData = data;
			}

			function get() {
				return savedData;
			}

			return {
				set: set,
				get: get
			}
		})

		// Services
			.service('viewer', ['$http', '$state', 'passData', 'resourcer', function($http, $state, passData, resourcer) {
				this.go = function(nickname) {
					var data = {};
					$http({
						url: 'http://localhost:8079/api/profiles/0/',
						method: 'GET',
						params: {nickname: nickname}
					})
						.then(function(response) {
							data.profile = response.data.profile;

							$http({
								url: 'http://localhost:8079/api/comments/',
								method: 'GET',
								params: {nickname: nickname}
							})
								.then(function(response) {
									data.comments = response.data.comments;
									passData.set(data);
									$state.go('pub_profile');
								});
						});
				};

				this.viewPost = function(id) {
					resourcer.getPost(id)
						.then(function(response) {
							passData.set(response.post);
							$state.go('post');
						})
				}
			}])

			.service('resourcer', ['$http', function($http) {
				var api = 'http://localhost:8079/api/';

				// Presentation
				this.getOne = function(resource, id, params) {
					return $http.get(api + resource + 's/' + id + '/', params)
						.then(function (response) {
							return response.data;
						})
				}

				// Post
				this.publishPost = function(post) {
					var req = postReqHelper(post);

					return $http.post(api + 'posts', req)
						.then(function(response) {
							return response;
						})
				}

				this.updatePost = function(post) {
					var req = postReqHelper(post);

					return $http.patch(api + 'posts/' + post.id, req)
						.then(function(response) {
							return response;
						})
				}

				this.deletePost = function(id) {
					return $http.delete(api + 'posts/' + id)
						.then(function(response) {
							return response;
						})
				}

				this.getPost = function(id) {
					return $http.get(api + 'posts/' + id)
						.then(function (response) {
							return response.data;
						})
				}

				// Comment
				this.publishComment = function(comment) {
					var req = commentReqHelper(comment);

					return $http.post(api + 'comments/', req)
						.then(function(response) {
							return response;
						})
				}

				this.updateComment = function(comment) {
					var req = commentReqHelper(comment);

					return $http.patch(api + 'comments/' + comment.id, req)
						.then(function(response) {
							return response;
						})
				}

				this.deleteComment = function(id) {
					return $http.delete(api + 'comments/' + id)
						.then(function(response) {
							return response;
						})
				}

				// Helpers
				var postReqHelper = function(post) {
					var req = {
						post: {
							admin_id: post.admin_id,
							nickname: post.nickname,
							title: post.title,
							body: post.body,
							category: post.category
						}
					};

					return req;
				}

				var commentReqHelper = function(comment) {
					var req = {
						comment:
							{
								post_id: comment.post_id,
								commentable_id: comment.commentable_id,
								commentable_type: comment.commentable_type,
								nickname: comment.nickname,
								body: comment.body,
								post_title: comment.post_title
							}
					}

					return req;
				}

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
