//检查更新应用
angular.module('noteApp.services')
    .factory('AppUpdateService', function ($ionicPlatform, $http, $cordovaAppVersion, $ionicPopup, $cordovaFileTransfer, $cordovaToast, $timeout, $ionicLoading, $cordovaFileOpener2, $cordovaFile, $q, appConfig){

        return {
            checkAppVersion: function (cb) {
                var defer = $q.defer();
                $http.get(appConfig.appVersionCheckServer)
                    .success(function (data) {
                        var newVersion = data.appInfo.android.version;
                        $ionicPlatform.ready(function() {
                            $cordovaAppVersion.getVersionNumber()
                            .then(function (version) {
                                if (newVersion !== version) {
                                    var changeLog = '';
                                    data.appInfo.android.changeLog.forEach(function (text, index) {
                                        changeLog += '<p>' + (index + 1) + '. ' + text + '</p>';
                                    });

                                    $ionicPopup.confirm({
                                        title: '检查到有新版本, 是否更新?',
                                        cssClass: 'app-confirm',
                                        template: changeLog,
                                        okText: '确定',
                                        cancelText: '取消'
                                    }).then(function (flag) {
                                        if (flag) {
                                            defer.resolve(data);
                                        } else {
                                            defer.reject();
                                        }
                                    });
                                } else {
                                    defer.reject();
                                }
                            }, function () {
                                defer.reject();
                            });
                        });
                    }).
                    error(function () {
                        defer.reject();
                    });

                    return defer.promise;
            },
            updateApp: function (data) {
                $ionicPlatform.ready(function() {
                    //优先存放在sd卡上
                    var targetPath = cordova.file.externalApplicationStorageDirectory || cordova.file.dataDirectory;

                    targetPath += appConfig.apkName;

                    $cordovaFileTransfer.download(data.appInfo.android.downloadURL, targetPath, {}, true)
                    .then(function (result) {
                        $timeout(function () {
                            $ionicLoading.hide();
                        });

                        $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive');
                    }, function (err) {
                        $ionicLoading.hide();
                        $cordovaToast.show('下载更新失败', 'long', 'center');
                    }, function (progress) {
                        $timeout(function () {
                            $ionicLoading.show({
                                template: '已经下载:' + (Math.floor(progress.loaded / progress.total * 100)) + '%'
                            });
                        });
                    });
                });
            }
        };
    });
