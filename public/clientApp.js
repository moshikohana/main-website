/**
 * Created by moshiko on 21/10/2017.
 */

angular.module("myApplication",["ui.router","ui.bootstrap"]).config(["$httpProvider","$stateProvider","$urlRouterProvider",function($httpProvider,$stateProvider,$urlRouterProvider){

    $urlRouterProvider.otherwise('/intro')
    $stateProvider.state(
        'Intro',{
            url:'/intro',
            controller:'IntroCtrl',
            templateUrl:'views/Intro.html',
        }
        ).state(
        'Resume',{
            url:'/resume',
            controller:'ResumeCtrl',
            templateUrl:'views/Resume.html',
        }

    ).state(
        'Projects',{
            url:'/projects',
            controller:'ProjectsCtrl',
            templateUrl:'views/Projects.html',

        })
        .state(
            'University.courses',{

                url:'/courses',
                controller:'CoursesCtrl',
                templateUrl:'views/courses.html',
            })

}]).run(["$rootScope","$state",function($rootScope,$state,loginService){
    console.log("Client side is running");

}]);