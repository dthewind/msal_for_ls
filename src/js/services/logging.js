(function (ng) {
    'use strict';

    ng.module('app')

        .provider('LoggingService', ['AppConfig', '$logProvider',
            function (AppConfig, $log) {

                var configLevel = ng.isDefined(AppConfig.logLevel) ? AppConfig.logLevel : 0;
                var configSend = ng.isDefined(AppConfig.logSend) ? AppConfig.logSend : 0;
                var levels = [
                    'debug', // 0
                    'info', // 1
                    'warn', // 2
                    'error', // 3
                    'severe' // 4
                ];

                var sendLog = function () {};

                var myGrowl = function () {};

                // var myGrowl = function (msg,config,func) {
                //     msg = msg || '??';
                //     config = ng.extend({},config);
                //     growl[func](msg,config);
                // };

                var myLog = function (msg, level, func) {
                    if (configLevel <= level) {
                        console[func](msg);
                    }
                }

                this.local = function (msg) {
                    console.log(msg);
                };

                this.localDoc = function (msg) {
                    if (AppConfig.isDebugDoc) {
                        console.log(msg);
                    }
                };

                this.log = this.debug = function (msg) {
                    myLog(msg, 0, 'log');
                };

                this.info = function (msg) {
                    myLog(msg, 1, 'info');
                };

                this.warn = function (msg) {
                    myLog(msg, 2, 'warn');
                };

                this.error = function (msg) {
                    myLog(msg, 3, 'error');
                };

                this.severe = function (msg) {
                    myLog(msg, 4, 'error');
                };

                this.growlSuccess = function (msg, config) {
                    myGrowl(msg, config, 'success');
                };

                this.growlError = function (msg, config) {
                    myGrowl(msg, config, 'error');
                };

                this.growlWarning = function (msg, config) {
                    myGrowl(msg, config, 'warning');
                };

                this.growlInfo = function (msg, config) {
                    myGrowl(msg, config, 'info');
                };

                this.$get = ['$log', '$http', '$q', //'growl',
                    function ($log, $http, $q, growl) {

                        myLog = function (msg, level, func) {
                            if (configLevel <= level) {
                                $log[func](msg);
                                sendLog(msg, level);
                            }
                        }

                        sendLog = function (msg, level) {
                            if (configSend <= level) {
                                if (ng.isString(msg)) {
                                    msg = '"' + msg + '"';
                                } else if (ng.isArray(msg)) {
                                    msg = ng.toJson(msg); //"'" + ng.toJson(msg) + "'";
                                } else if (ng.isObject(msg)) {
                                    msg = ng.toJson(msg); //"'" + ng.toJson(msg) + "'";
                                } else {
                                    msg = '"unknown type"';
                                }

                                // $http.post(AppConfig.apiPath + 'log', '{msg:' + msg + ',level:' + level + ',levelText:"' + levels[level] + '"}')
                                //     .then(
                                //         function (resp) {
                                //             //myGrowl('yeah',{ttl:-1},'success');
                                //         },
                                //         function (resp) {
                                //             myGrowl('There was an error.  Please contact development.', {
                                //                 ttl: -1
                                //             }, 'error');
                                //         }
                                //     );
                            }
                        };

                        myGrowl = function (msg, config, func) {
                            msg = msg || '??';
                            config = ng.extend({}, config);
                            growl[func](msg, config);
                            console.log('GROWL BEING CALLED');
                        };

                        return {
                            local: function (msg) {
                                $log.log(msg);
                            },

                            localDoc: function (msg) {
                                if (AppConfig.isDebugDoc) {
                                    $log.log(msg);
                                }
                            },

                            log: function (msg) {
                                myLog(msg, 0, 'log');
                            },

                            debug: function (msg) {
                                myLog(msg, 0, 'log');
                            },

                            info: function (msg) {
                                myLog(msg, 1, 'info');
                            },

                            warn: function (msg) {
                                myLog(msg, 2, 'warn');
                            },

                            error: function (msg) {
                                myLog(msg, 3, 'error');
                            },

                            severe: function (msg) {
                                myLog(msg, 4, 'error');
                            },

                            growlSuccess: function (msg, config) {
                                myGrowl(msg, config, 'success');
                            },

                            growlError: function (msg, config) {
                                myGrowl(msg, config, 'error');
                            },

                            growlWarning: function (msg, config) {
                                myGrowl(msg, config, 'warning');
                            },

                            growlInfo: function (msg, config) {
                                myGrowl(msg, config, 'info');
                            }
                        };
                    }
                ];
            }
        ])

        .service('LoggingServiceOld', ['AppConfig', '$log', '$http', '$q', //'growlNotifications',
            function (AppConfig, $log, $http, $q, growl) {

                var configLevel = ng.isDefined(AppConfig.logLevel) ? AppConfig.logLevel : 0;
                var configSend = ng.isDefined(AppConfig.logSend) ? AppConfig.logSend : 0;
                var levels = [
                    'debug', // 0
                    'info', // 1
                    'warn', // 2
                    'error', // 3
                    'severe' // 4
                ];

                function myGrowl(msg, config, func) {
                    msg = msg || '??';
                    config = ng.extend({}, config);
                    //growl[func](msg, config);
                    console.log('GROWL BEING CALLED');
                }

                function sendLog(msg, level) {
                    if (configSend <= level) {
                        if (ng.isString(msg)) {
                            msg = '"' + msg + '"';
                        } else if (ng.isArray(msg)) {
                            msg = ng.toJson(msg); //"'" + ng.toJson(msg) + "'";
                        } else if (ng.isObject(msg)) {
                            msg = ng.toJson(msg); //"'" + ng.toJson(msg) + "'";
                        } else {
                            msg = '"unknown type"';
                        }

                        // $http.post(AppConfig.apiPath + 'log', '{msg:' + msg + ',level:' + level + ',levelText:"' + levels[level] + '"}')
                        //     .then(
                        //         function (resp) {
                        //             //myGrowl('yeah',{ttl:-1},'success');
                        //         },
                        //         function (resp) {
                        //             myGrowl('There was an error.  Please contact development.', {
                        //                 ttl: -1
                        //             }, 'error');
                        //         }
                        //     );
                    }
                }

                function myLog(msg, level, func) {
                    if (configLevel <= level) {
                        $log[func](msg);
                        sendLog(msg, level);
                    }
                }

                this.local = function (msg) {
                    $log.log(msg);
                };

                this.localDoc = function (msg) {
                    if (AppConfig.isDebugDoc) {
                        $log.log(msg);
                    }
                };

                this.log = this.debug = function (msg) {
                    myLog(msg, 0, 'log');
                };

                this.info = function (msg) {
                    myLog(msg, 1, 'info');
                };

                this.warn = function (msg) {
                    myLog(msg, 2, 'warn');
                };

                this.error = function (msg) {
                    myLog(msg, 3, 'error');
                };

                this.severe = function (msg) {
                    myLog(msg, 4, 'error');
                };

                this.growlSuccess = function (msg, config) {
                    myGrowl(msg, config, 'success');
                };

                this.growlError = function (msg, config) {
                    myGrowl(msg, config, 'error');
                };

                this.growlWarning = function (msg, config) {
                    myGrowl(msg, config, 'warning');
                };

                this.growlInfo = function (msg, config) {
                    myGrowl(msg, config, 'info');
                };
            }
        ]);

})(angular);