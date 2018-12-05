const path = require('path');
(function (ng) {
    'use strict';

    ng.module('app')

        .directive("lsHeader", [
            function () {

                return {
                    restrict: 'EA',
                    replace: true,
                    template: require('../../templates/home/header.html'),

                    link: function lsHeaderVersionLink(scope, iElem, iAttrs, ctrls) {

                    }
                };
            }
        ])

    ;
})(angular);