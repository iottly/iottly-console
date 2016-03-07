'use strict';

/**
 * @ngdoc overview
 * @name iottlyMainApp
 * @description
 * # iottlyMainApp
 *
 * Main module of the application.
 */
angular
  .module('iottlyMainApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ]).value('API_URL', 'http://127.0.0.1:8550/')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
