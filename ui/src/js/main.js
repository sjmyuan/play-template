import angular from 'angular';
import loginController from './controller/loginController';
import loginService from './service/loginService';

const playApp = angular.module('playApp', []);
playApp.controller('loginController',loginController)
  .service('loginService', loginService);

export default playApp;
