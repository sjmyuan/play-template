class LoginService {
  constructor($http){
    this.http = $http;
  }

  login() {
    console.log('login');
  }
}

LoginService.$inject(['$http']);

export default LoginService;
