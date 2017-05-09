angular.module('PassportApp')
	.controller('AdminCtrl', adminCtrl);

	function adminCtrl($scope,$http){
		var model=this;
		model.deleteUser=deleteUser;

		findAllUsers()
			.then(renderAllUsers);
		
		function findAllUsers(){
			return $http.get('/admin/user')
				.then(function(response){
					console.log(response);
					return response.data;
				});
		}
			

		function deleteUser(user){
			return $http.delete('/admin/user/'+user._id)
				.then(function(){
					findAllUsers()
					.then(renderAllUsers);
				})
		}
		function renderAllUsers(users){
			console.log(users);
			model.users=users;
		}
	}