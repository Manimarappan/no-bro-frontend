import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: [''],
      countryCode: ['+91', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      userType: ['tenant', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData = {
        email: this.signupForm.value.email,
        firstName: this.signupForm.value.firstName,
        lastName: this.signupForm.value.lastName,
        phoneNumber: this.signupForm.value.countryCode + this.signupForm.value.phone,
        userType: this.signupForm.value.userType.toUpperCase(),
        password: this.signupForm.value.password
      };
       console.log("Form Data",formData);
       
      this.http.post('http://localhost:8080/api/users', formData).subscribe({
        next: (response: any) => {
          console.log('Signup successful', response);
          this.router.navigate(['/login']);
        },
         error: (error) => {
          console.error('Signup failed', error);
          const errorMessage = error.error?.message || 'Please check your input and try again.';
          if (error.error?.data) {
            const fieldErrors = Object.entries(error.error.data)
              .map(([field, message]) => `${field}: ${message}`)
              .join('\n');
            alert(`Signup failed:\n${fieldErrors}`);
          } else {
            alert(`Signup failed: ${errorMessage}`);
          }
        }
      });
    }
  }
}
