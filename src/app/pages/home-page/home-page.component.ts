import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RealEstate, Region } from '../../api/model';
import { GeographicalInformationService } from '../../api/services/geographical-information.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RealEstateCardComponent } from '../../components/real-estate-card/real-estate-card.component';
import { RealEstateService } from '../../api/services/real-estates.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddAgentDialogComponent } from '../../components/add-agent-dialog/add-agent-dialog.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    RealEstateCardComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  geographicalInformationService = inject(GeographicalInformationService);
  realEstateService = inject(RealEstateService);
  readonly dialog = inject(MatDialog);
  regions = false;
  area = false;
  priceCategory = false;
  numberOfBedrooms = false;
  regions$: Observable<Region[]> | undefined;
  realEstates$: Observable<RealEstate[]> | undefined;

  openDialog(): void {
    const dialogRef = this.dialog.open(AddAgentDialogComponent, {
      width: '1000px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  ngOnInit(): void {
    this.regions$ = this.geographicalInformationService.getRegions();
    this.realEstates$ = this.realEstateService.getRealEstates();
  }
}
