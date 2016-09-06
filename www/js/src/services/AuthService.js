//用户的账号密码
angular.module('noteApp.services')
    .factory('AuthService', ['$window', function ($window){
        return {
            getAuthInfo: function () {
                var json = $window.localStorage.getItem('authInfo');
                if (!!json) {
                    return $window.JSON.parse(json);
                }
                return null;
            },
            setAuthInfo: function (authInfo) {
                $window.localStorage.setItem('authInfo', $window.JSON.stringify(authInfo));
            },
            removeAuthInfo: function () {
                $window.localStorage.removeItem('authInfo');
            }
        };
    }]);
