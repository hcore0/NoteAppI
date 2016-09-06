//服务器地址
angular.module('noteApp.services')
    .factory('HostService', ['$window', function ($window){
        return {
            getHost: function () {
                return $window.localStorage.getItem('host');
            },
            setHost: function (host) {
                $window.localStorage.setItem('host', host);
            },
            removeHost: function () {
                $window.localStorage.removeItem('host');
            }
        };
    }]);