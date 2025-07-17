import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      console.log("Login Form Data", formData);

      this.http.post('http://localhost:8080/api/users/login', formData).subscribe({
        next: (response: any) => {
          console.log('Login successful', response);
          this.router.navigate(['/property-list']);
        },
        error: (error) => {
          console.error('Login failed', error);
          const errorMessage = error.error?.message || 'Invalid email or password';
          alert(`Login failed: ${errorMessage}`);
        }
      });
    }
  }
}
