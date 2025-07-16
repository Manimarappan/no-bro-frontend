import { Component, OnInit } from '@angular/core';
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
export class PropertyListComponent implements OnInit {
    properties: Property[] = [];
    filters: { propertyType: string, bhkType: string, furnishing: string, rent: number, city: string } = {
        propertyType: '',
        bhkType: '',
        furnishing: '',
        rent: 50000,
        city: ''
    };
    currentPage: number = 0;
    totalPages: number = 1;
    isLoading: boolean = false;
    error: string | null = null;
    private apiUrl = 'http://localhost:8080/api/properties/search';
    private addressApiUrl = 'http://localhost:8080/api/properties/address';

    propertyTypeOptions: string[] = ['APARTMENT', 'VILLA', 'COMMERCIAL'];
    furnishingOptions: string[] = ['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED'];
    bhkTypeOptions: string[] = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK+'];

    constructor(private http: HttpClient, private router: Router) {}

    ngOnInit(): void {
        this.loadProperties();
    }

    loadProperties(): void {
        this.isLoading = true;
        this.error = null;

        const params = {
            propertyType: this.filters.propertyType || '',
            bhk: this.filters.bhkType || '', // Map bhkType to bhk for backend
            furnishing: this.filters.furnishing || '',
            rent: this.filters.rent >= 0 ? this.filters.rent.toString() : '0',
            city: this.filters.city || '',
            page: this.currentPage.toString(),
            pageSize: '5'
        };

        this.http.get<{ success: boolean, message: string, data: { content: any[], totalPages: number, totalElements: number } }>(this.apiUrl, { params })
            .pipe(
                tap(async response => {
                    console.log('API Response:', response);
                    if (response.success) {
                        this.properties = await Promise.all(response.data.content.map(async item => {
                            const addressResponse = await firstValueFrom( //using addressId to fetch Address
                               this.http.get<{ success: boolean, data: any }>(`${this.addressApiUrl}/${item.address}`)
                            ).catch(() => ({ success: false, data: { location: 'Not specified' } }));
                            //storeing fetched data only into addres.
                            const address = addressResponse.success ? addressResponse.data : { area: 'Not specified', city: 'Not specified' };
                            //return and storing fetched property into properties
                            return {
                                id: item.propertyId,
                                title: item.propertyName,
                                price: item.price,
                                deposit: item.deposit,
                                area: item.area,
                                bhk: item.bhk,
                                city: `${address.city}`,
                                location : `${address.location}`,
                                propertyType: item.propertyType,
                                furnishing: item.furnishing,
                                status: item.status || (item.available ? 'Available' : 'Not Available'),
                                bedrooms: item.bedrooms,
                                bathrooms: item.bathrooms,
                                balconies: item.balconies,
                                floorNumber: item.floorNumber,
                                totalFloors: item.totalFloors,
                                yearBuilt: item.yearBuilt,
                                viewsCount: item.viewsCount,
                                listedBy: item.listedBy || item.userId,
                                isFeatured: item.featured || item.isFeatured,
                                imageId: item.imageId
                            };
                        }));
                        this.totalPages = response.data.totalPages;
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

    onApplyFilters(): void {
        this.currentPage = 0;
        this.loadProperties();
    }

    onResetFilters(): void {
        this.filters = { propertyType: '', bhkType: '', furnishing: '', rent: 50000, city: '' };
        this.currentPage = 0;
        this.loadProperties();
    }

    onPrevPage(): void {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.loadProperties();
        }
    }

    onNextPage(): void {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.loadProperties();
        }
    }

    viewDetails(id: string): void {
        this.router.navigate(['/property-detail', id]);
    }

    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }
}