import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from './../../auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {
  email: string;
  password: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  register() {
    this.authService
      .register(this.email, this.password)
      .subscribe((res: HttpResponse<any>) => {
        if (res.status == 200) {
          this.router.navigate(['/lists']);
        }
      });
  }
}
