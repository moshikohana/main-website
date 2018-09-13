/**
 * Created by moshiko on 21/10/2017.
 */
angular.module("myApplication").controller("ResumeCtrl",["$scope",function($scope){

    function init(){
        $scope.header = "This is Resume Page";
    }
    return init();
}]);
