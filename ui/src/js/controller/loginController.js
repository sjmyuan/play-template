class LoginController {
  constructor(service) {
    this.service = service;
  }

  login() {
    console.log('login');
  }
}

LoginController.$inject = ['loginService'];

export default LoginController;
