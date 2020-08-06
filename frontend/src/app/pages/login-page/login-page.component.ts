import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from './../../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  email: string;
  password: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.authService
      .login(this.email, this.password)
      .subscribe((res: HttpResponse<any>) => {
        if (res.status == 200) {
          this.router.navigate(['/lists']);
        }
      })
  }
}           
