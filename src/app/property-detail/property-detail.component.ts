import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Property } from '../models/property';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/User';
import { Address } from '../models/Address';
import { Image } from '../models/Image';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.css'
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  error: string | null = null;
  apiUrl = 'http://localhost:8080/api';

  image!:Image;
  address!:Address;
  user!:User;
  propertyData!:Property;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      await this.loadPropertyDetails(propertyId);
    }
  }

  async loadPropertyDetails(propertyId: string) {
    try {
      // Fetch property details
      const propertyResponse = await firstValueFrom(this.http.get<{ success: boolean, data: Property }>(`${this.apiUrl}/properties/${propertyId}`));
      if (propertyResponse.success) {
        const propertyData = propertyResponse.data;
        console.log(propertyData);
        // Fetch user details using userId
        const userResponse = await firstValueFrom(this.http.get<{ success: boolean, data: User }>(`${this.apiUrl}/users/${propertyData.userId}`));
        this.user = userResponse.success ? userResponse.data : {
          userId: propertyData.userId || 0,
          firstName: 'Unknown',
          lastName: '',
          email: 'Unknown',
          password: '',
          phoneNumber: '',
          userType: '',
          profilePic: '',
          isVerified: false,
          lastLogin: '',
          createdAt: '',
          updatedAt: '',
          status: ''
        };

        console.log(this.user);

        const addressResponse = await firstValueFrom(this.http.get<{ success: boolean, data: Address }>(`${this.apiUrl}/properties/address/${propertyData.address}`));
        this.address = addressResponse.success ? addressResponse.data : {
          addressId: propertyData.address || 0,
          street: 'Not specified',
          landmark: '',
          area: 'Not specified',
          city: 'Not specified',
          state: '',
          country: '',
          pinCode: '',
          latitude: 0,
          longitude: 0
        };

        console.log(this.address);

        // Fetch image details using imageId
        const imageResponse = await firstValueFrom(this.http.get<{ success: boolean, data: Image }>(`${this.apiUrl}/properties/images/${propertyData.imageId}`));
        console.log(imageResponse.success);
        this.image = {
          id: imageResponse.data?.id || propertyData.imageId || 0,
          data: `data:image/jpeg;base64,${imageResponse.data?.data || '/9j/4AAQSkZJRgABAQEAAAAAAAD/4QAuRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAAAAKAgAA...'}`
        };

        console.log(this.image);

        console.log("proprety: " ,propertyData);
        console.log("proprety: " ,this.property);

        // Assign fetched data to property
        this.property = {
          ...propertyData,
          // userId: user.userId,
          // propertyAddress: address,
          // image: image
        };

        
        this.error = null; // Clear error on successful load
      } else {
        this.error = 'Failed to load property details';
      }
    } catch (error) {
      console.error('Error loading property details:', error);
      this.property = null;
      this.error = 'An error occurred while loading property details';
    }
   
  }

  goBack() {
    this.router.navigate(['/property-list']);
  }
   
}