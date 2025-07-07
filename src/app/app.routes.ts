import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { AdminComponent } from './admin/admin.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', component: HomeComponent },
  { path: 'properties', component: PropertyListComponent },
  { path: 'property/:id', component: PropertyDetailComponent },
  { path: 'enquiry/:id', component: EnquiryComponent },
  { path: 'admin', component: AdminComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}