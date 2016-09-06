angular.module('noteApp.services')
    /**
     *附件上传
     */
    .service('MediaService', ['$ionicPlatform', '$cordovaFileTransfer', '$cordovaCamera', '$cordovaCapture', '$ionicLoading', '$cordovaToast', 'HostService', 'UserService', function ($ionicPlatform, $cordovaFileTransfer, $cordovaCamera, $cordovaCapture, $ionicLoading, $cordovaToast, HostService, UserService) {

        /**
         * 上传附件
         * @param  {String}   url     接收上传的url
         * @param  {String}   path    附件的路径
         * @param  {Object}   options 参数
         * @param  {Function} cb      上传成功的回调
         */
        var uploadFile = function(url, path, options, cb) {
            var user = UserService.getUser();
            options.fileKey = 'uploadFile';
            options.headers = {
                Authorization: 'Bearer ' + user.token
            };

            $cordovaFileTransfer.upload(HostService.getHost() + url, path, options)
                .then(function(result) {
                    $ionicLoading.hide();
                    cb(JSON.parse(result.response));
                }, function(err) {
                    $ionicLoading.hide();
                    $cordovaToast.show(JSON.stringify(err), 'long', 'center');
                }, function(progress) {
                    $ionicLoading.show({
                        template: '已完成 ' + (progress.loaded / progress.total * 100).toFixed(2) + '%'
                    });
                });
        };

        /**
         * 从相机采集照片
         * @param  {String} url        接收上传的url
         * @param  {function} onComplete 上传成功的回调
         */
        this.getPhotoFromCamera = function(url, onComplete) {
            $ionicPlatform.ready(function() {
                $cordovaCamera.getPicture({
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.CAMERA
                }).then(function(photo) {
                    uploadFile(url, photo, {}, onComplete);
                }, function(err) {
                    //用户取消操作
                });
            });
        };

        /**
         * 从相册采集照片
         * @param  {String} url        接收上传的url
         * @param  {function} onComplete 上传成功的回调
         */
        this.getPhotoFromLib = function(url, onComplete) {
            $ionicPlatform.ready(function() {
                $cordovaCamera.getPicture({
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                }).then(function(photo) {
                    uploadFile(url, photo, {}, onComplete);
                }, function(err) {
                    //用户取消操作
                });
            });
        };

        /**
         * 采集视频
         * @param  {String} url        接收上传的url
         * @param  {function} onComplete 上传成功的回调
         */
        this.getVideo = function(url, onComplete) {
            var options = {
                limit: 1,
                duration: 10
            };
            $ionicPlatform.ready(function() {
                $cordovaCapture.captureVideo(options).then(function (videoData) {
                    uploadFile(url, videoData[0].fullPath, {
                        mimeType: videoData[0].type,
                        fileName: videoData[0].name
                    }, onComplete);
                }, function(err) {
                    if (err.code === 3) {
                        //用户取消操作
                    } else {
                        $cordovaToast.show(JSON.stringify(err), 'long', 'center');
                    }
                });
            });
        };

        /**
         * 采集语音
         * @param  {String} url        接收上传的url
         * @param  {function} onComplete 上传成功的回调
         */
        this.getAudio = function(url, onComplete) {
            var options = {
                limit: 1
            };
            $ionicPlatform.ready(function() {
                $cordovaCapture.captureAudio(options).then(function(audioData) {
                    uploadFile(url, audioData[0].fullPath, {
                        mimeType: audioData[0].type,
                        fileName: audioData[0].name
                    }, onComplete);
                }, function(err) {
                    if (err.code === 3) {
                        //用户取消操作
                    } else {
                        $cordovaToast.show(JSON.stringify(err), 'long', 'center');
                    }
                });
            });
        };
    }]);