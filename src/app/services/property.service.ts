// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Property } from '../models/property';

// @Injectable({
//     providedIn: 'root'
// })
// export class PropertyService {
//     private apiUrl = 'http://localhost:8080/api/properties';
//     private imageApiUrl = 'http://localhost:8080/api/images';

//     constructor(private http: HttpClient) { }

//     getAllProperties(): Observable<Property[]> {
//         return this.http.get<Property[]>(this.apiUrl);
//     }

//     getImageById(imageId: number): Observable<Blob> {
//         return this.http.get(`${this.imageApiUrl}/${imageId}`, { responseType: 'blob' });
//     }
// }