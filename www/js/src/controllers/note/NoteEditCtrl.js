/**
 * 信息编辑 (新增)
 */
angular.module('noteApp.controllers')
.controller('NoteEditCtrl', function ($scope, $stateParams, $q, $ionicLoading, $http, $ionicHistory, $cordovaToast, $ionicPopup, RestUrls) {
        if ($stateParams.id) {
            //有参数id 是编辑
            $ionicLoading.show();
            
            //如果有其它异步请求(字典数据),使用$q.all控制流程
            $q.all([
                $http.get(RestUrls.note + '/' + $stateParams.id),
            ]).then(function (arr) {
                arr[0].data.createOn = new Date(arr[0].data.createOn);
                $scope.note = arr[0].data;
            }, function (err) {
                $cordovaToast.show(err, 'short', 'center');
            }).finally(function () {
                $ionicLoading.hide();
            });
        } else {
            //没有参数id 是新增
            $scope.note = {};
        }
       
        //保存
        $scope.save = function () {
            if ($stateParams.id) {
                //编辑已有项
                $http.put(RestUrls.note + '/' + $stateParams.id, $scope.note)
                .success(function (data, status) {
                    if (status === 200) {
                        $ionicHistory.goBack(-1);
                        $cordovaToast.show('保存成功', 'short', 'center');
                    }
                });
            } else {
                //新增
                $http.post(RestUrls.note, $scope.note)
                .success(function (data, status) {
                    if (status === 201) {
                        $ionicHistory.goBack(-1);
                        $cordovaToast.show('保存成功', 'short', 'center');
                    }
                });
            }
            
        };
    });