//用户信息
angular.module('noteApp.services')
    .factory('PictureViewerModal', ['$ionicModal', function ($ionicModal){
        return {
            getPVModal: function (options) {
                var photoModal;
                var slider;

                options.scope._pictureViewerData = {};

                options.scope._pictureViewerModalPhotos = options.photos;

                options.scope._closePictureViewerModal = function () {
                    photoModal.hide();
                };
                $ionicModal.fromTemplateUrl('templates/components/pictureViewerModal.html', {
                    scope: options.scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    photoModal = modal;
                });

                var watch = options.scope.$watch('_pictureViewerData.slider', function(nv, ov) {
                  if (nv !== ov) {
                    slider = options.scope._pictureViewerData.slider;
                    watch();
                  }
                });

                return {
                    show: function (index) {
                        slider.activeIndex = index || 0;
                        photoModal.show();
                    },
                    remove: function () {
                        photoModal.remove();
                        slider = null;
                        delete options.scope._options;
                        delete options.scope._pictureViewerData;
                        delete options.scope._pictureViewerModalPhotos;
                        delete options.scope._closePictureViewerModal;
                    }
                };
            }
        };
    }]);
