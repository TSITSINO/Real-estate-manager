import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RealEstate, Region } from '../../api/model';
import { GeographicalInformationService } from '../../api/services/geographical-information.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RealEstateCardComponent } from '../../components/real-estate-card/real-estate-card.component';
import { RealEstateService } from '../../api/services/real-estates.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, RealEstateCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  geographicalInformationService = inject(GeographicalInformationService);
  realEstateService = inject(RealEstateService);
  regions = false;
  area = false;
  priceCategory = false;
  numberOfBedrooms = false;
  regions$: Observable<Region[]> | undefined;
  realEstates$: Observable<RealEstate[]> | undefined;

  ngOnInit(): void {
    this.regions$ = this.geographicalInformationService.getRegions();
    this.realEstates$ = this.realEstateService.getRealEstates();
  }
}
