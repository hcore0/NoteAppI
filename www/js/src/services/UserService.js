//用户信息
angular.module('noteApp.services')
    .factory('UserService', ['$window', function ($window){
        return {
            getUser: function () {
                var json =  $window.localStorage.getItem('user');

                if (!!json) {
                    return $window.JSON.parse(json);
                }
                return null;
            },
            setUser: function (user) {
                $window.localStorage.setItem('user', $window.JSON.stringify(user));
            },

            removeUser: function () {
                $window.localStorage.removeItem('user');
            }
        };
    }]);
