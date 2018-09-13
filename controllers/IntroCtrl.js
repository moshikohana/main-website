/**
 * Created by moshiko on 21/10/2017.
 */
angular.module("myApplication").controller("IntroCtrl",["$scope",function($scope){

    function init(){
        $scope.header = "Intro Page";
    }
    return init();
}]);
