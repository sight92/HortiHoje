﻿(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());
    
    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/login' });
    }

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/login',
                config: {
                    templateUrl: 'app/login/login.html',
                    title: 'login',
                }
            },
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }, {
                url: '/activities',
                config: {
                    title: 'activities',
                    templateUrl: 'app/activity/activities.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-calendar"></i> Activities'
                    }
                }
            }, {
                url: '/reporters',
                config: {
                    title: 'reporters',
                    templateUrl: 'app/reporter/reporters.html',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-calendar"></i> Reporters'
                    }
                }
            }
        ];
    }
})();