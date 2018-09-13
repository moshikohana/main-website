/**
 * Created by moshiko on 21/10/2017.
 */
angular.module("myApplication").controller("ProjectsCtrl",["$scope",function($scope){

    function init(){
        $scope.header = "Projects Page";
    }
    return init();
}]);
