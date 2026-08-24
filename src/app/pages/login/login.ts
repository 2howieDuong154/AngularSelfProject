import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  loginObject: any = {
    userName: '',
    password: '',
  };
  constructor(private http: HttpClient) {
  }
 router = inject(Router);

  onLogin() {
    console.log('Login object:', this.loginObject);
    this.http.post(environment.API_URL + "login", this.loginObject).subscribe({
      next: (response: any) => {
        debugger;
        console.log('Login response:', response);
        if (response.result) {
          // Handle successful login
          alert('Login successful!');
          this.router.navigate(['admin/dashboard']);
        } else {
          alert(response.message || 'Login failed. Please check your credentials.');
        }
      },
      error: (error) => {
        debugger;
        console.error('Login error:', error);
      }
    });
  }
}
