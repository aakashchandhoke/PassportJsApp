angular.module('PassportApp')
	.controller('ProfileCtrl', profileCtrl);

	function profileCtrl($scope,$http,$location){
		var model=this;
		model.unRegister=unRegister;


		function unRegister(userId){
			return $http.delete('/user/'+userId)
				.then(function(){
					$location.url('/login');
				});

		}
	}