//字典列表
angular.module('noteApp.directives')
    .directive('selectPopup', function($ionicModal){

        return {
            scope: {
                options: '=',
                title: '@'
            },
            require: 'ngModel',
            restrict: 'E',
            template: '<div class="select-popup" on-touch="showModal()"></div>',
            replace: true,
            link: function($scope, $elem, $attr, $controller) {
                var dicModal;

                //helper 把id 数组转换为id 和 文字的 对象数组
                function key2Entity (modelValue) {
                    var arr = [];
                    $scope.options.forEach(function (o) {
                        if (modelValue.indexOf(o.key) > -1) {
                            arr.push(o);
                        }
                    });
                    return arr;
                }

                //重写渲染方法
                $controller.$render = function () {
                    if (!!$controller.$viewValue && $controller.$viewValue.length > 0) {
                        $elem.html($controller.$viewValue.map(function (item) {
                            return item.value;
                        }).join(' , '));
                    } else {
                        $elem.html('还没有选择');
                    }
                };

                //由$modelValue 向 $viewValue 转时会依次经过$formatters, 最后返回的值作为$viewValue
                $controller.$formatters.push(function (v) {
                    if (!!v && !!$scope.options) {
                        return key2Entity(v);
                    }

                    return [];
                });

                //由$viewValue 向 $modelValue 转时会依次经过$parsers, 最后返回的值作为$modleValue
                $controller.$parsers.push(function (v) {
                    return v.map(function (item) {
                        return item.key;
                    });
                });

                //$viewValue改变时调用渲染方法
                $controller.$viewChangeListeners.push(function (v) {
                    $controller.$render();
                });


                //加载模态框模板
                $ionicModal.fromTemplateUrl('templates/components/selectPopup.html', {
                    scope: $scope
                }).then(function(modal) {
                    dicModal = modal;
                });

                $scope.showModal = function() {
                    //将$modelValue中的id 对应的选项状态置为选中
                    $scope.options.forEach(function (p) {
                        if ($controller.$modelValue.indexOf(p.key) > -1) {
                            p.checked = true;
                        } else {
                            p.checked = false;
                        }
                    });
                    dicModal.show();
                };

                $scope.submitModal = function () {
                    //使用最新的选中状态 改变$viewValue
                    var selected = $scope.options.filter(function (s) {
                        return s.checked;
                    });
                    $controller.$setViewValue(selected);
                    dicModal.hide();
                };

                $scope.cancelModal = function () {
                    dicModal.hide();
                };

                $scope.$on('$destroy', function () {
                    dicModal.remove();
                });
            }
        };
    });