import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './career.component.html',
  styleUrl: './career.component.css'
})
export class CareerComponent implements OnInit{
  jobs = [
    { title: 'Frontend Developer', location: 'Bangalore, India', type: 'Full-Time', description: 'Build responsive UI for our rental platform.' },
    { title: 'Backend Engineer', location: 'Remote', type: 'Full-Time', description: 'Develop scalable APIs for property listings.' },
    { title: 'UX Designer', location: 'Bangalore, India', type: 'Contract', description: 'Design user-friendly interfaces for renters.' }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  getSafeImageUrl(image: string | null): SafeUrl | string {
    return image
      ? this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${image}`)
      : '/assets/images/exels-naimbic-2.jpg';
  }

  // Simulate job application form submission
  submitApplication(form: any) {
    console.log('Application submitted:', form);
    // Add API call to submit form data
  }
}
