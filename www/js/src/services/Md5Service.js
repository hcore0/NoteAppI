//登录密码md5加密
angular.module('noteApp.services')
    .factory('Md5Service', ['$window', 'appConfig', function ($window, appConfig){
        return {
            encrypt: function (value) {
                var pwd = $window.md5(value);
                return $window.md5(pwd + appConfig.salt);
            }
        };
    }]);
