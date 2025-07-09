import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, CommonModule],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.css'
})
export class PropertyListComponent {
  @Input() properties: any[] = [];
  @Input() filters: { propertyType: string, furnishing: string, rent: number, location: string } = { propertyType: '', furnishing: '', rent: 50000, location: '' };
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() applyFilters = new EventEmitter<void>();
  @Output() resetFilters = new EventEmitter<void>();
  @Output() prevPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  viewDetails(id: number) {
    console.log(`View details for property ID: ${id}`);
    // Add navigation logic here if needed
  }
}
