/**
 * 信息查看
 */
angular.module('noteApp.controllers')
.controller('NoteViewCtrl', function ($scope, $stateParams, $http, $cordovaToast, $ionicLoading, RestUrls) {
    $ionicLoading.show();

    $http.get(RestUrls.note + '/' + $stateParams.id)
    .success(function (data) {
        data.createOn = new Date(data.createOn);
        $scope.note = data;
    })
    .error(function (err) {
        $cordovaToast.show(err, 'long', 'center');
    })
    .finally(function() {
        $ionicLoading.hide();
    });
});