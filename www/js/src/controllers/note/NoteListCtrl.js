/**
 * 笔记列表
 */
angular.module('noteApp.controllers')
.controller('NoteListCtrl', function ($scope, $http, $cordovaToast, $ionicPopup, RestUrls) {

    $scope.hasMore = true; //是否有下一页
    var pageCount = 0;     //当前页码
    $scope.notes = [];     //列表数据, 初始为空

    //删除一条消息
    $scope.remove = function (note) {
        $ionicPopup.confirm({
            title: '删除这条记录',
            cssClass: 'app-confirm',
            template: '确定要删除这条记录吗',
            okText: '确定',
            cancelText: '取消'
        }).then(function (flag) {
            if (flag) {
                $http.delete(RestUrls.note + '/' + note._id)
                .success(function (data, status) {
                    if (status === 204) {
                        $scope.notes.splice($scope.notes.indexOf(note), 1);
                    }
                    $cordovaToast.show(data.msg, 'short', 'center');
                }).error(function (err) {
                    $cordovaToast.show(err, 'long', 'center');
                });
            }
        });
    };

    //刷新列表
    $scope.refresh = function () {
        $http.get(RestUrls.note, {params: {page: 1}})
        .success(function (data) {
            $scope.notes = data;
            $scope.hasMore = true;
            pageCount = 1;
            $scope.$broadcast('scroll.refreshComplete');
        })
        .error(function (err) {
            $cordovaToast.show(err, 'long', 'center');
        })
        .finally(function () {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    
    //加载下一页
    $scope.loadMore = function () {
        $http.get(RestUrls.note, {params: {page: pageCount + 1}})
        .success(function (data) {
            if (data.length > 0) {
                $scope.notes = $scope.notes.concat(data);
                pageCount++;
            } else {
                $scope.hasMore = false;
                $cordovaToast.show('这已经是最后一页了', 'short', 'bottom');
            }
        })
        .error(function (err) {
            $scope.hasMore = false;
            $cordovaToast.show(err, 'long', 'center');
        })
        .finally(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
});