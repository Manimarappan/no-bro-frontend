import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../models/property';

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
  private apiUrl = 'http://localhost:8080/api/properties'; // Hardcoded API URL

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<{ success: boolean, message: string, data: Property }>(`${this.apiUrl}/${id}`)
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.property = response.data;
            } else {
              this.error = response.message || 'Failed to load property details.';
            }
          },
          error: () => this.error = 'Failed to load property details.'
        });
    }
  }
}