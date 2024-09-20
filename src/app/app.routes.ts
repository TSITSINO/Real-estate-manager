import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AddListingPageComponent } from './pages/add-listing-page/add-listing-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  {
    path: 'home-page',
    component: HomePageComponent,
  },
  {
    path: 'add-Listing',
    component: AddListingPageComponent,
  },
];
