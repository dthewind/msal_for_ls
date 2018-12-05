(function (ng) {
    'use strict';

    ng.module('app')

        .directive("lsHome", [
            function () {
                return {
                    restrict: 'EA',
                    replace: true,
                    template: require('../../templates/home/main.html')
                };
            }
        ])

    ;
})(angular);