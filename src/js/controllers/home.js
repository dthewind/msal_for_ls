(function (ng) {
    'use strict';

    ng.module('app')

        .controller('HomeController', ['LoggingService', '$scope', '$state',
            function (LoggingService, $scope, $state) {
                LoggingService.debug('homeController');

                $scope.click = function () {
                    LoggingService.log('hello');
                    $state.go('home.sub');
                };
            }
        ])

        .controller('SubController', ['LoggingService', '$scope', '$state',
            function (LoggingService, $scope, $state) {
                LoggingService.debug('SubController');

                $scope.click = function () {
                    LoggingService.log('hello');
                    $state.go('home.sub');
                };
            }
        ])

    ;
})(angular);