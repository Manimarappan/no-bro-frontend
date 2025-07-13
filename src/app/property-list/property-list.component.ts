import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Property } from '../models/property';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, CommonModule, HttpClientModule],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent {
  @Input() properties: Property[] = [];
  @Input() filters: { propertyType: string, furnishing: string, rent: number, location: string } = { 
    propertyType: '', 
    furnishing: '', 
    rent: 50000, 
    location: '' 
  };
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() applyFilters = new EventEmitter<void>();
  @Output() resetFilters = new EventEmitter<void>();
  @Output() prevPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  isLoading: boolean = false;
  error: string | null = null;
  private apiUrl = 'http://localhost:8080/api/properties';
  
  constructor(private http: HttpClient, private router: Router) {
    this.loadProperties(); // Fetch properties on initialization
  }

  // Fetch properties from the server
loadProperties(): void {
  this.isLoading = true;
  this.error = null;
  const params = {
    propertyType: this.filters.propertyType || '',
    furnishing: this.filters.furnishing || '',
    rent: this.filters.rent.toString(),
    location: this.filters.location || '',
    page: this.currentPage.toString(),
    pageSize: '10'
  };

  this.http.get<{ success: boolean, message: string, data: any[] }>(this.apiUrl, { params })
  .pipe(
    tap(async response => {
      console.log('API Response:', response);
      if (response.success) {
        this.properties = await Promise.all(response.data.map(async item => {
          // Fetch address details using the address ID
          const addressResponse = await firstValueFrom(this.http.get<{ success: boolean, data: any }>(`${this.apiUrl}/address/${item.address}`));
          const address = addressResponse.success ? addressResponse.data : { area: 'Not specified', city: 'Not specified' };

          return {
            id: item.propertyId, // Map backend's propertyId to id
            title: item.propertyName, // Map propertyName to title
            rent: item.price, // Map price to rent
            deposit: item.deposit,
            area: item.area,
            location: `${address.area}, ${address.city}`, // Combine area and city for location
            type: item.propertyType, // Map propertyType to type
            furnishing: item.furnishing,
            availability: item.status || item.available ? 'Available' : 'Not Available', // Map status or available to availability
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            balconies: item.balconies,
            floorNumber: item.floorNumber,
            totalFloors: item.totalFloors,
            yearBuilt: item.yearBuilt,
            viewsCount: item.viewsCount,
            listedBy: item.listedBy || item.userId, // Map listedBy or userId
            isFeatured: item.featured || item.isFeatured, // Map featured or isFeatured
            imageId: item.imageId,
          };
        }));
        console.log('Mapped Properties:', this.properties); // Debug mapped data
        this.totalPages = response.data.length > 0 ? Math.ceil(response.data.length / 10) : 1; // Adjust based on backend pagination
        this.isLoading = false;
      } else {
        this.error = response.message || 'Failed to load properties.';
        this.isLoading = false;
      }
    }),
    catchError(error => {
      console.error('HTTP Error:', error);
      this.error = 'Failed to load properties. Please try again.';
      this.isLoading = false;
      return this.handleError(error);
    })
  )
  .subscribe();
  
}

  // Handle filter application
  onApplyFilters(): void {
    this.currentPage = 1; // Reset to first page
    this.loadProperties();
    this.applyFilters.emit();
  }

  // Handle filter reset
  onResetFilters(): void {
    this.filters = { propertyType: '', furnishing: '', rent: 50000, location: '' };
    this.currentPage = 1;
    this.loadProperties();
    this.resetFilters.emit();
  }

  // Handle pagination
  onPrevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProperties();
      this.prevPage.emit();
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProperties();
      this.nextPage.emit();
    }
  }

  // Navigate to property details
  viewDetails(id: string): void {
    this.router.navigate(['/property-detail', id]); // Navigate to a details route
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}