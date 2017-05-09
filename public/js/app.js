var app = angular.module('PassportApp', ['ngRoute']);

app.config(function($routeProvider, $httpProvider){
    $routeProvider
        .when('/', {
            templateUrl: '/views/home/home.html',
        })
        .when('/profile', {
            templateUrl: 'views/profile/profile.html',
            controller: 'ProfileCtrl',
            controllerAs: 'model',
            resolve: {
                 loggedin: checkLoggedin
            }
        })
        .when('/login', {
            templateUrl: 'views/login/login.html',
            controller: 'LoginCtrl'
        })
        .when('/register', {
            templateUrl: 'views/register/register.html',
            controller: 'RegisterCtrl'
        })
        .when('/admin', {
            templateUrl: 'views/admin/admin.html',
            controller: 'AdminCtrl',
            controllerAs: 'model',
            resolve: {
                 loggedin: isAdmin
            }
        })
        .otherwise({
            redirectTo: '/'
        });

    /*$httpProvider
    .interceptors
    .push(function($q, $location)
    {
        return {
            response: function(response)
            { 
                return response;
            },
            responseError: function(response)
            {
                if (response.status === 401)
                    $location.url('/login');
                return $q.reject(response);
            }
        };
    });*/ 
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
{
    var deferred = $q.defer();

    $http.get('/loggedin').success(function(user)
    {
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user !== '0')
            deferred.resolve();
        // User is Not Authenticated
        else
        {
            $rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/login');
        }
    });
    
    return deferred.promise;
};

var isAdmin = function($q, $timeout, $http, $location, $rootScope)
{
    var deferred = $q.defer();

    $http.get('/isAdmin').success(function(user)
    {
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user !== '0')
            deferred.resolve();
        // User is Not Authenticated
        else
        {
            $rootScope.errorMessage = 'You are not an admin.';
            deferred.reject();
            $location.url('/profile');
        }
    });
    
    return deferred.promise;
};

app.controller('NavCtrl',function($scope,$http,$location){
    $scope.logout=function(){
        $http.post("/logout")
        .success(function(){
            $location.url("/home");
        })
    }
    
});