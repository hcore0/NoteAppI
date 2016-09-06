//配置rest地址
angular.module('noteApp')
    .constant('RestUrls', {
        login: '/api/login',
        note: '/api/note',
        upload: '/api/upload',
        user: '/api/user'
    });