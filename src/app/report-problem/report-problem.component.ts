import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-report-problem',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-problem.component.html',
  styleUrl: './report-problem.component.css'
})
export class ReportProblemComponent {
  reportText: string = '';
  errorMessage: string = '';

  constructor() { }

  onSubmit() {
    // Simulated login check (replace with actual authentication logic)
    const isLoggedIn = this.checkUserLoginStatus();

    if (!isLoggedIn) {
      this.errorMessage = 'Please log in to submit a problem report.';
      return;
    }

    if (this.reportText.trim()) {
      // Simulate form submission (replace with actual API call or backend logic)
      console.log('Problem Report Submitted:', this.reportText);
      this.errorMessage = '';
      this.reportText = ''; // Clear form after submission
      alert('Thank you! Your problem report has been submitted.');
    } else {
      this.errorMessage = 'Please describe the problem before submitting.';
    }
  }

  private checkUserLoginStatus(): boolean {
    // Placeholder for actual login check (e.g., check token, session, or auth service)
    // Replace with your authentication service logic
    return false; // Simulating a non-logged-in user for demo purposes
  }

}
