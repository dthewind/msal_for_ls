(function (ng) {
    'use strict';

    ng.module('app')

        .controller('HomeController', ['LoggingService', '$scope', '$state',
            function (LoggingService, $scope, $state) {
                LoggingService.debug('HomeController');

                $scope.click = function () {
                    $state.go('home.sub');
                };
            }
        ])

        .controller('SubController', ['LoggingService', '$scope', '$state',
            function (LoggingService, $scope, $state) {
                LoggingService.debug('SubController');
            }
        ])

    ;
})(angular);