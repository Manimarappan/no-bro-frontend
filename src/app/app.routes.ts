// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { LikedPropertiesComponent } from './liked-properties/liked-properties.component';
import { ProfileComponent } from './profile/profile.component';

import { TermsComponent } from './terms/terms.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { CareerComponent } from './career/career.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'enquiry', component: EnquiryComponent },
  { path: 'property-list', component: PropertyListComponent },
  { path: 'property-detail/:id', component: PropertyDetailComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'liked-properties', component: LikedPropertiesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'add-property', component: AddPropertyComponent},
  { path: 'about-us', component:AboutUsComponent},
  { path: 'career', component:CareerComponent},
  // { path: '', redirectTo: '/home', pathMatch: 'full' }
  { path: '', redirectTo: '/property-list', pathMatch: 'full' }
];