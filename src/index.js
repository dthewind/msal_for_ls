var Msal = require('msal');
var angular = require('angular');

require('@azure/msal-angularjs');
require('@uirouter/angularjs');
require('ngStorage');

var modules = [
    'ui.router',
    'MsalAngular',
    'ngStorage'
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
    //$locationProvider.html5Mode(true).hashPrefix('#');
}

angular.module('app', modules)
    .constant('AppConfig', {
        b2c: {
            clientID: '36a43f27-7ee4-4ce6-8027-0385c3180ccd',
            authority: "https://login.microsoftonline.com/tfp/cerrulliassociatesb2cdev.onmicrosoft.com/B2C_1_SignUpOrIn",
            //authority: "https://login.microsoftonline.com/cerrulliassociatesb2cdev.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_SignUpOrIn",
            b2cScopes: ["https://cerrulliassociatesb2cdev.onmicrosoft.com/lodestar/api"], //, "https://graph.microsoft.com/User.Read"], // "https://cerrulliassociatesb2cdev.onmicrosoft.com/api/read"],
            webApi: 'https://cerrulliassociatesb2cdev.onmicrosoft.com/lodestar'
        }
    });

{
    angular.module('app')
        .config(['AppConfig', 'LoggingServiceProvider', 'msalAuthenticationServiceProvider', '$locationProvider', '$httpProvider', '$urlRouterProvider', '$stateProvider',
            function (AppConfig, LoggingService, msal, $locationProvider, $httpProvider, $urlRouterProvider, $stateProvider) {
                LoggingService.debug('app.config: ' + AppConfig.b2c.redirectPath);

                // see function @ line 37
                htmlMode($locationProvider);

                function doStates() {
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
                }

                doStates();

                var msalUserAgent = new Msal.UserAgentApplication(
                    AppConfig.b2c.clientID,
                    AppConfig.b2c.authority,
                    msalTokenReceivedCallback(LoggingService), {
                        //msalTokenReceivedCallback(LoggingService), {
                        storeAuthStateInCookie: true,
                        cacheLocation: 'localStorage',
                        logger: msalLogger(LoggingService),
                        //postLogoutRedirectUri: AppConfig.hrefs['logout']['href'],
                        state: location.hash,
                        //protectedResourceMap: protectedResourceMap
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
                            state: location.hash,
                            //protectedResourceMap: protectedResourceMap,
                            //unprotectedResources: [],
                            storeAuthStateInCookie: true,
                            isAngular: true // probably not necessary,
                        },
                        routeProtectionConfig: {
                            popUp: false,
                            requireLogin: false
                        }
                    }, $httpProvider);
                } catch (error) {
                    LoggingService.error('msal.init:error');
                    LoggingService.error(error);
                    if (error.indexOf("Url required") !== -1) {
                        for (var i in localStorage) {
                            if (i.indexOf("msal") !== -1 || i.indexOf("clientId") !== -1) {
                                delete localStorage[i];
                            }
                        }
                    }
                }

                function tokenSuccess(token) {
                    LoggingService.debug('tokenSuccess: ' + token);
                }

                msalUserAgent.acquireTokenSilent(AppConfig.b2c.b2cScopes, AppConfig.b2c.authority)
                    .then(
                        tokenSuccess,
                        function (error) {
                            if (error.indexOf("user_login_error") !== -1) {
                                msalUserAgent.loginRedirect(AppConfig.b2c.b2cScopes, AppConfig.b2c.authority);
                            } else {
                                msalUserAgent.acquireTokenRedirect(AppConfig.b2c.b2cScopes, AppConfig.b2c.authority)
                                    .then(
                                        tokenSuccess,
                                        function (error) {
                                            LoggingService.error('token error: ' + error);
                                        }
                                    );
                            }
                        }
                    );
            }
        ]);


    angular.module('app')
        .run(['$rootScope', '$trace', '$transitions', 'LoggingService',
            function ($rootScope, $trace, $transitions, LoggingService) {

                LoggingService.debug("app.run");

                $trace.enable('TRANSITION');
            }
        ]);
}

require.context("./js/", true, /\.js$/).keys().map(function (val) {
    require('./js/' + val.substring(2));
});