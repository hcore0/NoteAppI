//子模块
angular.module('noteApp.controllers', []);
angular.module('noteApp.services', []);
angular.module('noteApp.directives', []);
angular.module('noteApp.filters', []);

//主模块
angular.module('noteApp', ['ionic', 'ngCordova', 'ngMessages','noteApp.controllers', 'noteApp.services', 'noteApp.directives', 'noteApp.filters'])
.run(function ($ionicPlatform, $cordovaStatusbar, $rootScope, AppUpdateService) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      //android无效
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  //检查更新
  // AppUpdateService.checkAppVersion().then(function (data) {
  //   AppUpdateService.updateApp(data);
  // });

  //控制是否显示tab栏和navBar
  $rootScope.ui = {
    showNavBar: true,
    showTab: true
  };
})
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $sceProvider, UserServiceProvider) {
  //路由
  $stateProvider
    //登陆
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
      onEnter: function ($rootScope) {
        //登陆页不显示tab 和 navbar
        $rootScope.ui.showNavBar = false;
        $rootScope.ui.showTab = false;
      }
    })
    .state('app', {
      url: '/app',
      abstract: true,  //只能被子状态激活
      templateUrl: 'templates/tabs.html',
      onEnter: function ($rootScope) {
        $rootScope.ui.showNavBar = true;
      }
    })
    //笔记
    .state('app.note', {
      url: '/note',
      views: {
        'tab-note': {
          templateUrl: 'templates/note/list.html',
          controller: 'NoteListCtrl'
        }
      },
      onEnter: function ($rootScope) {
        $rootScope.ui.showTab = true;
      }
    })
    .state('app.note_view', {
      url: '/note/:id',
      views: {
        'tab-note': {
          templateUrl: 'templates/note/view.html',
          controller: 'NoteViewCtrl'
        }
      },
      onEnter: function ($rootScope) {
        $rootScope.ui.showTab = false;
      }
    })
    .state('app.note_edit', {
      url: '/note/edit/:id',
      views: {
        'tab-note': {
          templateUrl: 'templates/note/edit.html',
          controller: 'NoteEditCtrl'
        }
      },
      onEnter: function ($rootScope) {
        $rootScope.ui.showTab = false;
      }
    })
    //个人
    .state('app.personal', {
      url: '/personal',
      views: {
        'tab-personal': {
          templateUrl: 'templates/personal/personal.html',
          controller: 'PersonalCtrl'
        }
      },
      onEnter: function ($rootScope) {
        $rootScope.ui.showTab = true;
      }
    })
    .state('app.personal_user', {
      url: '/user',
      views: {
        'tab-personal': {
          templateUrl: 'templates/personal/user.html',
          controller: 'UserCtrl'
        }
      },
      onEnter: function ($rootScope) {
        $rootScope.ui.showTab = false;
      }
    });

    //如果用户已经登录 直接跳到主页
    if (!!UserServiceProvider.$get().getUser()) {
        $urlRouterProvider.otherwise('/app/note');
    } else {
        $urlRouterProvider.otherwise('/login');
    }

  //导航放在下边
  $ionicConfigProvider.tabs.position('bottom');
  //设为ios风格的导航
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.navBar.alignTitle('center');

  //给每个rest请求附加token在query param中
  $httpProvider.interceptors.push(function (UserService, HostService, $injector, $q, $cordovaToast) {
      return {
          request: function(config) {
              var user = UserService.getUser();

              //不处理模板文件请求和完整的url请求
              if (/.html$/.test(config.url) || /^http:/.test(config.url)) {
                  return config;
              }

              config.url = HostService.getHost() + config.url;

              //用户为未登录
              if (!user) {
                return config;
              }

              //对每次请求添加token
              config.headers.Authorization = 'Bearer ' + user.token;
              return config;
          },

          response: function(response) {
            if (response.data.status === 401) {
              $cordovaToast.show('请重新登陆', 'short', 'center');
              $injector.get('$state').transitionTo('login');
            }
            return response;
          },

          responseError: function(response) {
            //跳转到登陆页面
            //不能直接依赖注入$state, 有循环依赖的问题, 需要手动注入
            $injector.get('$state').transitionTo('login');
            return $q.reject(response);
          }
      };
  });

  //$sceProvider.enabled(false);
}).constant('appConfig', {
  salt: '', //登录密码加盐
  appVersionCheckServer: 'http://192.168.0.106:3000/api/version', //更新应用服务器
  apkName: 'note.apk'
});
