var addPoll = angular.module('addPoll', []);

addPoll.controller('pollCtrl', function ($scope) {

    $scope.choices = [{ answer: '' }];

    $scope.addChoice = function () {
        //var newItemNo = $scope.choices.length + 1;
        //$scope.choices.push({ 'name': 'choice' + newItemNo, number: 10 });
        $scope.choices.push({ answer: '' });
    };
})