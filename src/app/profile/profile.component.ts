import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  userId: number = Number(localStorage.getItem('userId')) || 1;
  isEditing: boolean = false;
  updatedUser: any = {};
  error: string | null = null;
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    if (!this.userId || this.userId <= 0) {
      this.error = 'Please log in to view profile';
      this.router.navigate(['/login']);
      return;
    }

    this.http.get(`http://localhost:8080/api/users/${this.userId}`).subscribe({
      next: (response: any) => {
        console.log('User profile loaded', response);
        if (response.success) {
          this.user = response.data;
          this.updatedUser = { ...response.data }; // Initialize edit form
          this.error = null;
        } else {
          this.error = response.message || 'Failed to load profile';
        }
      },
      error: (error) => {
        console.error('Failed to load profile', error);
        this.error = 'Failed to load profile: ' + (error.error?.message || 'Please try again');
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.error = null;
    this.selectedFile = null;
  }

  updateProfile() {
    if (!this.userId || this.userId <= 0) {
      this.error = 'Please log in to update profile';
      return;
    }

    this.http.put(`http://localhost:8080/api/users/${this.userId}`, this.updatedUser).subscribe({
      next: (response: any) => {
        console.log('Profile updated', response);
        if (response.success) {
          this.user = { ...this.updatedUser };
          this.isEditing = false;
          this.error = null;
        } else {
          this.error = response.message || 'Failed to update profile';
        }
      },
      error: (error) => {
        console.error('Update failed', error);
        this.error = 'Failed to update profile: ' + (error.error?.message || 'Please try again');
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadProfilePic() {
    if (!this.selectedFile) {
      this.error = 'No file selected';
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', this.selectedFile);

    this.http.put(`http://localhost:8080/api/users/${this.userId}/profile-pic`, formData).subscribe({
      next: (response: any) => {
        console.log('Profile picture updated', response);
        if (response.success) {
          this.user.profilePic = response.data.image;
          this.selectedFile = null;
          this.isEditing = false;
          this.error = null;
        } else {
          this.error = response.message || 'Failed to upload profile picture';
        }
      },
      error: (error) => {
        console.error('Upload failed', error);
        this.error = 'Failed to upload profile picture: ' + (error.error?.message || 'Please try again');
      }
    });
  }

  signOut() {
    localStorage.removeItem('userId');
    console.log('User signed out, userId removed from localStorage');
    this.router.navigate(['/login']);
  }
}