const path = require('path');

var Msal = require('msal');
var angular = require('angular');

require('@azure/msal-angularjs');
require('@uirouter/angularjs');
require('ngStorage');

var modules = [
    'ui.router',
    'MsalAngular',
    'ngStorage',
    // 'ngSanitize',
    // 'ui.bootstrap',
    // 'dtw.icons',
    // 'dtw.folders',
    // 'ls.folderSelect',
    // 'ls.tableauPreview',
    // 'ui.tree'
];

var msalLogger = function (LoggingService) {
    return new Msal.Logger(
        function (logLevel, message, piiEnabled) {
            LoggingService.info(message);
        }, {
            level: Msal.LogLevel.Verbose,
            correlationId: '12345'
        }
    );
};

var msalTokenReceivedCallback = function (LoggingService) {
    return function (errorDesc, token, error, tokenType) {
        if (token) {
            LoggingService.info("msalTokenReceivedCallback: token received: in callback " + token)
        } else if (error) {
            LoggingService.error("msalTokenReceivedCallback: error received: in callback " + error)
        }
    };
};

function htmlMode($locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('');
    //$locationProvider.html5Mode(false).hashPrefix('#');
    //$locationProvider.html5Mode(true).hashPrefix('#');
}

angular.module('app', modules)
    .constant('AppConfig', {
        b2c: {
            clientID: '36a43f27-7ee4-4ce6-8027-0385c3180ccd',
            authority: "https://login.microsoftonline.com/tfp/cerrulliassociatesb2cdev.onmicrosoft.com/B2C_1_SignUpOrIn/",
            //authority: 'https://login.microsoftonline.com/common',
            b2cScopes: ["https://cerrulliassociatesb2cdev.onmicrosoft.com/lodestar/api"],
            webApi: 'https://cerrulliassociatesb2cdev.onmicrosoft.com/lodestar',
            redirectPath: 'http://localhost:4400'
        }
    });

if (window !== window.parent && !window.opener) {
    angular.module('app')
        .config(['AppConfig', 'LoggingServiceProvider', 'msalAuthenticationServiceProvider', '$locationProvider', '$httpProvider',
            function (AppConfig, LoggingService, msal, $locationProvider, $httpProvider) {
                LoggingService.debug('app.config.opener: ' + AppConfig.b2c.redirectPath);

                htmlMode($locationProvider);

                try {
                    msal.init({
                        clientID: AppConfig.b2c.clientID,
                        authority: AppConfig.b2c.authority,
                        tokenReceivedCallback: msalTokenReceivedCallback(LoggingService),
                        optionalParams: {
                            cacheLocation: 'localStorage',
                            logger: msalLogger(LoggingService),
                            storeAuthStateInCookie: true,
                            isAngular: true // probably not necessary
                        },
                        routeProtectionConfig: {
                            popUp: true
                        }
                    }, $httpProvider);
                } catch (error) {
                    LoggingService.error('msal.init:error');
                    LoggingService.error(error);
                }
            }
        ]);
} else {
    angular.module('app')
        .config(['AppConfig', 'LoggingServiceProvider', 'msalAuthenticationServiceProvider', '$locationProvider', '$httpProvider', '$urlRouterProvider', '$stateProvider',
            function (AppConfig, LoggingService, msal, $locationProvider, $httpProvider, $urlRouterProvider, $stateProvider) {
                LoggingService.debug('app.config: ' + AppConfig.b2c.redirectPath);

                htmlMode($locationProvider);

                $stateProvider
                    .state('home', {
                        url: '/',
                        template: require('./templates/home/version.html'),
                        controller: 'HomeController'
                    })
                    .state('home.sub', {
                        url: 'sub',
                        template: require('./templates/home/sub.html'),
                        controller: 'SubController'
                    });

                $urlRouterProvider.otherwise(
                    function ($injector) {
                        var $state = $injector.get('$state');
                        $state.transitionTo('home');
                    }
                );

                try {
                    msal.init({
                        clientID: AppConfig.b2c.clientID,
                        authority: AppConfig.b2c.authority,
                        tokenReceivedCallback: msalTokenReceivedCallback(LoggingService),
                        optionalParams: {
                            cacheLocation: 'localStorage',
                            logger: msalLogger(LoggingService),
                            validateAuthority: true,
                            redirectUri: AppConfig.b2c.redirectPath,
                            postLogoutRedirectUri: AppConfig.b2c.redirectPath,
                            navigateToLoginRequestUrl: false,
                            //protectedResourceMap: protectedResourceMap,
                            //unprotectedResources: [],
                            storeAuthStateInCookie: true,
                            isAngular: true // probably not necessary
                        },
                        routeProtectionConfig: {
                            popUp: false,
                            requireLogin: true
                        }
                    }, $httpProvider);
                } catch (error) {
                    LoggingService.error('msal.init:error');
                    LoggingService.error(error);
                }

                var clientApplication = new Msal.UserAgentApplication(
                    AppConfig.b2c.clientID,
                    AppConfig.b2c.authority,
                    msalTokenReceivedCallback(LoggingService), {
                        storeAuthStateInCookie: true,
                        cacheLocation: 'localStorage',
                        logger: msalLogger(LoggingService)
                    }
                );

                function loadApplication(token) {
                    LoggingService.debug('tokenReceived: ' + token);
                }

                clientApplication.acquireTokenSilent(AppConfig.b2c.b2cScopes, AppConfig.b2c.authority)
                    .then(
                        loadApplication,
                        function (error) {
                            console.log('yuppers2: ' + error);
                            setTimeout(function () {
                                if (error.indexOf("user_login_error") !== -1) {
                                    clientApplication.loginRedirect(AppConfig.b2c.b2cScopes, AppConfig.b2c.authority);
                                } else {
                                    clientApplication.acquireTokenRedirect(AppConfig.b2c.b2cScopes, AppConfig.b2c.authority)
                                        .then(
                                            loadApplication,
                                            function (error) {
                                                LoggingService.error('token error: ' + error);
                                            }
                                        );
                                }
                            }, 1000);

                        }
                    );
            }
        ]);


    angular.module('app')
        .run(['$rootScope', '$trace', '$transitions', 'LoggingService',
            function ($rootScope, $trace, $transitions, LoggingService) {

                LoggingService.debug("app.run");
                // $rootScope.$on('msal:acquireTokenSuccess', function (event, tokenOut) {
                //     LoggingService.info('msal:acquireTokenSuccess: ' + tokenOut);
                // });

                // $rootScope.$on("msal:acquireTokenFailure", function (event, errorDesc, error) {
                //     LoggingService.info('msal:acquireTokenFailure: ' + error);
                // });

                $trace.enable('TRANSITION');
            }
        ]);
}

require.context("./js/", true, /\.js$/).keys().map(function (val) {
    require('./js/' + val.substring(2));
});