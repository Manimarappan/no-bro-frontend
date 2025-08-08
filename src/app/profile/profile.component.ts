import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit {
  user: any = null;
  properties: any[] = [];
  userId: number = Number(localStorage.getItem('userId'));
  isEditing: boolean = false;
  updatedUser: any = {};
  selectedFile: File | null = null;
  showUpdateForm: boolean = false;
  selectedProperty: any = {};
  bhks: string[] = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK'];
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadUserProperties();
  }

  loadUserProfile() {

    console.log("userId", this.userId);
    if (!this.userId || this.userId <= 0) {
      this.error = 'Please log in to view profile';
      this.router.navigate(['/login']);
      return;
    }

      // for profile section
    this.http.get(`http://localhost:8080/api/users/${this.userId}`).subscribe({
      next: (response: any) => {
        console.log('User profile loaded', response);
        if (response.success) {
          this.user = response.data;
          this.updatedUser = { ...response.data };
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


  loadUserProperties() {
    this.http.get(`http://localhost:8080/api/properties/userid/${this.userId}`).subscribe({
      next: (response: any) => {
        console.log('User properties loaded', response);
        if (response.success) {
          this.properties = response.data.map((property: any) => ({
            ...property,

          }));

          // Fetch address and image for each property
          this.properties.forEach((property, index) => {
            if (property.address) {
              this.fetchAddress(property.address, index);
            }
            if (property.imageId) {
              this.fetchImage(property.imageId, index);
            }
          });

          // console.log('Mapped properties', this.properties);
          this.error = null;
        } else {
          this.error = response.message || 'Failed to load properties';
        }
      },
      error: (error) => {
        console.error('Failed to load properties', error);
        this.error = 'Failed to load properties: ' + (error.error?.message || 'Please try again');
      }
    });
  }

  fetchAddress(addressId: number, index: number) {
    this.http.get(`http://localhost:8080/api/properties/address/${addressId}`).subscribe({
      next: (response: any) => {
        // console.log('Address loaded', response);
        if (response.success) {
          this.properties[index].address = {
            addressId: response.data.addressId || addressId,
            street: response.data.street || '',
            landmark: response.data.landmark || '',
            location: response.data.location || '',
            city: response.data.city || 'Unknown',
            state: response.data.state || '',
            country: response.data.country || '',
            pinCode: response.data.pinCode || '',
            latitude: response.data.latitude || 0,
            longitude: response.data.longitude || 0
          };
          // console.log('Updated address for property', this.properties[index]);
        } else {
          this.properties[index].address = {
            addressId,
            street: '',
            landmark: '',
            location: '',
            city: 'Unknown',
            state: '',
            country: '',
            pinCode: '',
            latitude: 0,
            longitude: 0
          };
          console.warn('Failed to load address details', response.message);
        }
      },
      error: (error) => {
        console.error('Failed to load address', error);
        this.properties[index].address = {
          addressId,
          street: '',
          landmark: '',
          location: '',
          city: 'Unknown',
          state: '',
          country: '',
          pinCode: '',
          latitude: 0,
          longitude: 0
        };
        this.error = 'Failed to load address: ' + (error.error?.message || 'Please try again');
      }
    });
    // console.log("final res",this.properties);
  }

  fetchImage(imageId: number, index: number) {
    this.http.get(`http://localhost:8080/api/images/${imageId}`).subscribe({
      next: (response: any) => {
        // console.log('Image loaded', response);
        if (response.success) {
          this.properties[index].image = {
            imageId: response.data.imageId || imageId,
            fileName: response.data.fileName || 'property.jpg',
            data: response.data.data || '',
            // url: response.data.data ? `data:image/jpeg;base64,${response.data.data}` : 'assets/placeholder.jpg'
          };
          // console.log('.......................Updated image for property', this.properties[index]);
        } else {
          this.properties[index].image = {
            imageId,
            fileName: 'property.jpg',
            data: '',
            // url: 'assets/placeholder.jpg'
          };
          console.warn('Failed to load image details', response.message);
        }
      },
      error: (error) => {
        console.error('Failed to load image', error);
        this.properties[index].image = {
          imageId,
          fileName: 'property.jpg',
          data: '',
          // url: 'assets/placeholder.jpg'
        };
        this.error = 'Failed to load image: ' + (error.error?.message || 'Please try again');
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
        // console.log('Profile updated', response);
        if (response.success) {
          this.user = { ...this.updatedUser };
          this.isEditing = false;
          this.error = null;
          alert('Profile updated successfully!');
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
      if (this.selectedFile.type !== 'image/jpeg' || this.selectedFile.size > 1000000) {
        this.error = 'Please upload a JPEG image smaller than 1 MB.';
        this.selectedFile = null;
      }
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
        // console.log('Profile picture updated', response);
        if (response.success) {
          this.user.profilePic = response.data.image;
          this.selectedFile = null;
          this.isEditing = false;
          this.error = null;
          alert('Profile picture updated successfully!');
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

  openUpdateForm(property: any): void {
    this.selectedProperty = JSON.parse(JSON.stringify(property));
    // console.log("/////////////////////property", property);
    this.showUpdateForm = true;
  }

  closeUpdateForm(): void {
    this.showUpdateForm = false;
    this.selectedProperty = {};
    this.error = null;
  }

  
updateProperty(): void {
  if (!this.selectedProperty.propertyId) {
    this.error = 'Invalid property selected.';
    return;
  }

  //  console.log("------+++++++++++selectedProperty", this.selectedProperty);
  // Extract child entities (address and image)
  const { address, image, ...propertyData } = this.selectedProperty;

  console.log("Updating main property data", propertyData);
  // console.log("-------- address", address);
  // console.log("------image", image);

  // Update main property (without address and image)
  this.http.put(`http://localhost:8080/api/properties/${this.selectedProperty.propertyId}`, propertyData).subscribe({
    next: (response: any) => {
      console.log('Main property updated', response);
      if (response.success) {

        // Update address if exists
          this.http.put(`http://localhost:8080/api/addresses/${address.addressId}`, address).subscribe({
            next: (addressResponse: any) => {
              console.log('Address updated', addressResponse);
              if (!addressResponse.success) {
                console.warn('Address update failed', addressResponse.message);
              }
            },
            error: (addressError) => {
              console.error('Address update failed', addressError);
            }
          });

         // Update images
          // this.http.put(`http://localhost:8080/api/images/${this.selectedProperty.imageId}`, image).subscribe({
          //   next: (imageResponse: any) => {
          //     console.log('Image updated', imageResponse);
          //     if (!imageResponse.success) {
          //       console.warn('Image update failed', imageResponse.message);
          //     }
          //   },
          //   error: (imageError) => {
          //     console.error('Image update failed', imageError);
          //   }
          // });

        // Reload and close form
        this.loadUserProperties();
        this.closeUpdateForm();
        alert('Property updated successfully!');
      } else {
        this.error = response.message || 'Failed to update property';
      }
    },
    error: (error) => {
      console.error('Main property update failed', error);
      this.error = 'Failed to update property: ' + (error.error?.message || 'Please try again');
    }
  });
}


  onPropertyFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'image/jpeg' && file.size < 1000000) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedProperty.image = {
          fileName: file.name,
          // url: reader.result as string,
          data: (reader.result as string).split(',')[1] // Base64 data
        };
      };
      reader.readAsDataURL(file);
    } else {
      this.error = 'Please upload a JPEG image smaller than 1 MB.';
    }
  }

  deleteProperty(propertyId: string): void {
    if (confirm('This property will be deleted from No-Bro and won\'t display to tenant. Are you sure?')) {
      this.http.delete(`http://localhost:8080/api/properties/${propertyId}`).subscribe({
        next: (response: any) => {
          console.log('Property deleted', response);
          if (response.success) {
            this.loadUserProperties();
            alert('Property deleted successfully!');
          } else {
            this.error = response.message || 'Failed to delete property';
          }
        },
        error: (error) => {
          console.error('Delete failed', error);
          this.error = 'Failed to delete property: ' + (error.error?.message || 'Please try again');
        }
      });
    }
  }

  signOut() {
    localStorage.removeItem('userId');
    console.log('User signed out, userId removed from localStorage');
    this.router.navigate(['/login']);
  }
}