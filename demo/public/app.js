angular.module('koaauth', [])
    .controller('AuthController',
        function ($scope, $http, $cacheFactory) {
            $scope.username = '';
            $scope.password = '';
            $scope.token = '';
            $scope.cache = $cacheFactory('mycache');

            $scope.submit = function () {
                $http.post("/login", {
                    username: $scope.username,
                    password: $scope.password
                }).
                success(function (data, status, headers, config) {
                    $scope.cache.put("token", data);
                    $scope.token = data;
                }).
                error(function (data, status, headers, config) {
                    console.log('Error logging in');
                });
            };

            $scope.gosecure = function () {
                var token = $scope.cache.get("token");

                $http.get("/secure", {
                    headers: {
                        Authorization: token
                    }
                }).
                success(function (data, status, headers, config) {
                    alert(data);

                }).
                error(function (data, status, headers, config) {
                    alert('You need to authenticate');
                });
            };
        });