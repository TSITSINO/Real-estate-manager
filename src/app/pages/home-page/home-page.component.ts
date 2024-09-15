import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Region } from '../../api/model';
import { GeographicalInformationService } from '../../api/services/geographical-information.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  geographicalInformationService = inject(GeographicalInformationService);
  regions = false;
  area = false;
  priceCategory = false;
  numberOfBedrooms = false;
  regions$: Observable<Region[]> | undefined;

  ngOnInit(): void {
    this.regions$ = this.geographicalInformationService.getRegions();
  }
}
