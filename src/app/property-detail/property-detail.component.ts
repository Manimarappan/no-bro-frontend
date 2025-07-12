// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Property } from '../models/property';
// import { firstValueFrom } from 'rxjs';
// import { User } from '../models/User';
// import { Address } from '../models/Address';
// import { Image } from '../models/Image';

// @Component({
//   selector: 'app-property-detail',
//   standalone: true,
//   imports: [HttpClientModule, CommonModule],
//   templateUrl: './property-detail.component.html',
//   styleUrl: './property-detail.component.css'
// })
// export class PropertyDetailComponent implements OnInit {
//   property: Property | null = null;
//   apiUrl = 'your-api-url'; // Replace with your actual API URL

//   constructor(
//     private http: HttpClient,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   async ngOnInit() {
//     const propertyId = this.route.snapshot.paramMap.get('id');
//     if (propertyId) {
//       await this.loadPropertyDetails(propertyId);
//     }
//   }

//   async loadPropertyDetails(propertyId: string) {
//     try {
//       // Fetch property details
//       const propertyResponse = await firstValueFrom(this.http.get<{ success: boolean, data: Property }>(`${this.apiUrl}/property/${propertyId}`));
//       if (propertyResponse.success) {
//         const propertyData = propertyResponse.data;

//         // Fetch user details using userId
//         const userResponse = await firstValueFrom(this.http.get<{ success: boolean, data: User }>(`${this.apiUrl}/user/${propertyData.userId}`));
//         const user: User = userResponse.success ? userResponse.data : {
//           userId: propertyData.userId || 0,
//           firstName: 'Unknown',
//           lastName: '',
//           email: 'Unknown',
//           password: '',
//           phoneNumber: '',
//           userType: '',
//           profilePic: '',
//           isVerified: false,
//           lastLogin: '',
//           createdAt: '',
//           updatedAt: '',
//           status: ''
//         };

//         // Fetch address details using addressId (extracted from location)
//         // const addressId = this.extractAddressIdFromLocation(propertyData.location);
//         const addressResponse = await firstValueFrom(this.http.get<{ success: boolean, data: Address }>(`${this.apiUrl}/address/${propertyData.addressId}`));
//         const address: Address = addressResponse.success ? addressResponse.data : {
//           addressId: propertyData.location || 0,
//           street: 'Not specified',
//           landmark: '',
//           area: 'Not specified',
//           city: 'Not specified',
//           state: '',
//           country: '',
//           pinCode: '',
//           latitude: 0,
//           longitude: 0
//         };

//         // Fetch image details using imageId
//         const imageResponse = await firstValueFrom(this.http.get<{ success: boolean, data: Image }>(`${this.apiUrl}/image/${propertyData.imageId}`));
//         const image: Image = imageResponse.success ? imageResponse.data : {
//           id: propertyData.imageId || 0,
//           data: 'placeholder-image.jpg'
//         };

//         // Assign fetched data to property
//         this.property = {
//           ...propertyData,
//           userId: user.userId,
//           // propertyAddress: address,
//           // image: image
//         };
//       }
//     } catch (error) {
//       console.error('Error loading property details:', error);
//       this.property = null;
//     }
//   }

//   goBack() {
//     this.router.navigate(['/property-list']);
//   }
// }