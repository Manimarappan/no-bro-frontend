import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-liked-properties',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './liked-properties.component.html',
  styleUrl: './liked-properties.component.css'
})
export class LikedPropertiesComponent implements OnInit {
  properties: any[] = [];
  userId: number = Number(localStorage.getItem('userId')) || 1; // Get from login
  totalProperties: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadLikedProperties();
  }

  loadLikedProperties() {
    this.http.get(`http://localhost:8080/api/liked-properties?userId=${this.userId}&page=0&pageSize=5`).subscribe({
      next: (response: any) => {
        console.log('Liked properties loaded', response);
        this.totalProperties = response.data.totalElements;
        this.properties = response.data.content.map((property: any) => ({
          ...property,
          city: null, // Placeholder for city
          image: null // Placeholder for base64 image
        }));

        // Fetch city and image for each property
        this.properties.forEach((property, index) => {
          this.fetchCity(property.address, index);
          this.fetchImage(property.imageId, index);
        });
      },
      error: (error) => {
        console.error('Failed to load liked properties', error);
        alert('Failed to load liked properties: ' + (error.error?.message || 'Please try again'));
      }
    });
  }

  fetchCity(addressId: number, index: number) {
    this.http.get(`http://localhost:8080/api/properties/address/${addressId}`).subscribe({
      next: (response: any) => {
        this.properties[index].city = response.data.city;
        console.log("address", response);
      },
      error: (error) => {
        console.error('Failed to load city', error);
        this.properties[index].city = 'Unknown';
      }
    });
  }

  fetchImage(imageId: number, index: number) {
    this.http.get(`http://localhost:8080/api/images/${imageId}`).subscribe({
      next: (response: any) => {
        this.properties[index].image = 'data:image/jpeg;base64,' + response.data;
      },
      error: (error) => {
        console.error('Failed to load image', error);
        this.properties[index].image = 'assets/placeholder.jpg'; // Fallback image
      }
    });
  }

  removeProperty(propertyId: string) {
    this.http.delete(`http://localhost:8080/api/liked-properties/${propertyId}?userId=${this.userId}`).subscribe({
      next: () => {
        console.log('Property unliked');
        this.loadLikedProperties(); // Refresh the list
      },
      error: (error) => {
        console.error('Unlike failed', error);
        alert('Failed to remove property: ' + (error.error?.message || 'Please try again'));
      }
    });
  }
}
