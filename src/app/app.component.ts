import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { PropertyListComponent } from './property-list/property-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, PropertyListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  filters = { propertyType: '', furnishing: '', rent: 50000, location: '' };
  properties = [
    { id: 1, title: '2BHK in Ds-Max-Sigma', location: 'Electronic City Phase-1, Bangalore', type: 'apartment', furnishing: 'semi-furnished', rent: 24000, deposit: 120000, area: 1350, availability: 'Immediate' },
    { id: 2, title: '3BHK Villa', location: 'Electronic City, Bangalore', type: 'villa', furnishing: 'furnished', rent: 35000, deposit: 150000, area: 1800, availability: 'Within 15 days' },
    { id: 3, title: '1BHK Studio', location: 'Electronic City, Bangalore', type: 'studio', furnishing: 'unfurnished', rent: 15000, deposit: 60000, area: 900, availability: 'After 30 days' },
    { id: 4, title: '2BHK Apartment', location: 'Bangalore', type: 'apartment', furnishing: 'semi-furnished', rent: 22000, deposit: 110000, area: 1200, availability: 'Immediate' },
    { id: 5, title: '3BHK Duplex', location: 'Electronic City Phase-1', type: 'duplex', furnishing: 'furnished', rent: 40000, deposit: 200000, area: 2000, availability: 'Within 30 days' },
    { id: 6, title: '1BHK Loft', location: 'Bangalore', type: 'loft', furnishing: 'unfurnished', rent: 18000, deposit: 80000, area: 1000, availability: 'Immediate' },
    { id: 7, title: '2BHK Townhouse', location: 'Electronic City', type: 'townhouse', furnishing: 'semi-furnished', rent: 26000, deposit: 130000, area: 1400, availability: 'Within 15 days' },
    { id: 8, title: '3BHK Penthouse', location: 'Bangalore', type: 'penthouse', furnishing: 'furnished', rent: 45000, deposit: 220000, area: 2200, availability: 'After 30 days' },
    { id: 9, title: '1BHK Cottage', location: 'Electronic City Phase-1', type: 'cottage', furnishing: 'unfurnished', rent: 20000, deposit: 90000, area: 1100, availability: 'Immediate' },
    { id: 10, title: '2BHK Condo', location: 'Bangalore', type: 'condo', furnishing: 'semi-furnished', rent: 25000, deposit: 125000, area: 1300, availability: 'Within 15 days' },
    { id: 11, title: '3BHK Mansion', location: 'Electronic City', type: 'mansion', furnishing: 'furnished', rent: 50000, deposit: 250000, area: 2500, availability: 'Within 30 days' },
    { id: 12, title: '1BHK Cabin', location: 'Bangalore', type: 'cabin', furnishing: 'unfurnished', rent: 16000, deposit: 70000, area: 950, availability: 'Immediate' },
    { id: 13, title: '2BHK Chalet', location: 'Electronic City Phase-1', type: 'chalet', furnishing: 'semi-furnished', rent: 27000, deposit: 135000, area: 1450, availability: 'Within 15 days' },
    { id: 14, title: '3BHK Estate', location: 'Bangalore', type: 'estate', furnishing: 'furnished', rent: 48000, deposit: 240000, area: 2300, availability: 'After 30 days' },
    { id: 15, title: '1BHK Lodge', location: 'Electronic City', type: 'lodge', furnishing: 'unfurnished', rent: 19000, deposit: 85000, area: 1050, availability: 'Immediate' },
  ];
  currentPage = 1;
  itemsPerPage = 15;

  get filteredProperties() {
    return this.properties.filter(property => 
      (!this.filters.propertyType || property.type === this.filters.propertyType) &&
      (!this.filters.furnishing || property.furnishing === this.filters.furnishing) &&
      (property.rent <= this.filters.rent) &&
      (!this.filters.location || property.location.toLowerCase().includes(this.filters.location.toLowerCase()))
    );
  }

  get paginatedProperties() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProperties.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredProperties.length / this.itemsPerPage);
  }

  applyFilters() {
    this.currentPage = 1; // Reset to first page on filter
  }

  resetFilters() {
    this.filters = { propertyType: '', furnishing: '', rent: 50000, location: '' };
    this.currentPage = 1;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }
}
