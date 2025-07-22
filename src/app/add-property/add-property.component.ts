import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.css'
})
export class AddPropertyComponent implements OnInit {
  isLoggedIn: boolean = false;
  userId: number = Number(localStorage.getItem('userId')) || 0;
  property: any = {
    propertyName: '',
    propertyType: '',
    address: null,
    bhk: '',
    furnishing: '',
    status: '',
    price: 0,
    deposit: 0,
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    balconies: 0,
    floorNumber: 0,
    totalFloors: 0,
    parking: false,
    yearBuilt: 0,
    listedBy: '',
    userId: this.userId,
    imageId: null,
    isFeatured: false
  };
  address: any = {
    street: '',
    landmark: '',
    location: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    latitude: 0,
    longitude: 0
  };
  selectedFile: File | null = null; // For Image
  error: string | null = null;
  successMessage: string | null = null;
  bhks: string[] = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', '6BHK', '7BHK', '8BHK', '9BHK', '10BHK'];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.userId > 0;
    if (!this.isLoggedIn) {
      this.error = 'Please log in to post a property';
    }
    this.property.userId = this.userId;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'image/jpeg') {
        this.error = 'Only JPEG images are allowed';
        this.selectedFile = null;
        return;
      }
      if (file.size > 1000000) {
        this.error = 'Image size exceeds 1 MB limit';
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
      this.error = null;
    }
  }

  submitProperty() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/signup']);
      return;
    }

    // Step 1: Submit Address
    console.log('Address:', this.address);
    this.http.post('http://localhost:8080/api/addresses', this.address).subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log('Address Response:', response);
          this.property.address = response.data.addressId;
          this.submitImage();
        } else {
          this.error = response.message || 'Failed to save address';
        }
      },
      error: (error) => {
        console.error('Address submission failed', error);
        this.error = 'Failed to save address: ' + (error.error?.message || 'Please try again');
      }
    });
  }

  submitImage() {
    if (!this.selectedFile) {
      this.error = 'Please upload a property image';
      return;
    }

    const formData = new FormData();
    formData.append('data', this.selectedFile);

    // Step 2: Submit Image
    console.log('Image:',formData );
    this.http.post('http://localhost:8080/api/images', formData).subscribe({
      next: (response: any) => {
        console.log('Image Response:', response);
        if (response.success) {
          this.property.imageId = response.data.id;
          this.submitPropertyDetails();
        } else {
          this.error = response.message || 'Failed to upload image';
        }
      },
      error: (error) => {
        console.error('Image upload failed', error);
        this.error = 'Failed to upload image: ' + (error.error?.message || 'Please try again');
      }
    });
  }

  submitPropertyDetails() {
    // Step 3: Submit Property
    console.log('Property:', this.property);
    this.http.post('http://localhost:8080/api/properties', this.property).subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log('Property Response:', response);
          this.successMessage = 'Property posted successfully!';
          this.error = null;
        } else {
          this.error = response.message || 'Failed to post property';
        }
      },
      error: (error) => {
        console.error('Property submission failed', error);
        this.error = 'Failed to post property: ' + (error.error?.message || 'Please try again');
      }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
