(function (ng) {
    'use strict';

    ng.module('app')

        .controller('AppController', ['$rootScope', '$scope', '$document', 'LoggingService',
            function ($rootScope, $scope, $document, LoggingService) {

                LoggingService.debug('AppController');
            }
        ])

    ;

})(angular);