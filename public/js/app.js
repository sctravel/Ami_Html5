
var app = angular.module("ami_pacer", ['itemProcessor']);
app.controller("testCtrl" ,function($scope,$http,audioProcessor) {

    $scope.questions = [];
    $scope.current = {};
    $scope.currIndex = 0;
    $scope.isVolumeCheck = true;
    $scope.audio={};
    $scope.$on('audio', function (event, data) {
        $scope.audio=data;
    });

    $scope.next = function(){
        $scope.current = {};
        $scope.currIndex = $scope.currIndex +1 ;

        $scope.current=$scope.questions[$scope.currIndex];

        testcurrent = $scope.current;
        $scope.audio.pause();
        $scope.audio.src='';
        audioProcessor.process($scope.current,$scope.audio);


    };



    $http.get("/questionSet").success(function(data){
        test = data;
        $scope.questions = data;
        $scope.current = $scope.questions[0];
        audioProcessor.process($scope.current,$scope.audio);
    });

    $scope.$watch('current', function() {
        // do something here
        if($scope.current.audio !=''){

        }
    }, true);
});
