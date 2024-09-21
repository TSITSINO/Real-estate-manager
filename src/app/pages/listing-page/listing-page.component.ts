import { Component, inject, OnInit } from '@angular/core';
import { GeographicalInformationService } from '../../api/services/geographical-information.service';
import { RealEstateService } from '../../api/services/real-estates.service';
import { MatDialog } from '@angular/material/dialog';
import { find, Observable } from 'rxjs';
import { Agent, RealEstate, Region } from '../../api/model';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from '../../api/services/agent.service';
import { CommonModule } from '@angular/common';
import { DeleteListingDialogComponent } from './delete-listing-dialog/delete-listing-dialog.component';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RealEstateCardComponent } from '../../components/real-estate-card/real-estate-card.component';

@Component({
  selector: 'app-listing-page',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    ButtonModule,
    TagModule,
    RealEstateCardComponent,
  ],
  templateUrl: './listing-page.component.html',
  styleUrl: './listing-page.component.scss',
})
export class ListingPageComponent implements OnInit {
  private readonly geographicalInformationService = inject(
    GeographicalInformationService
  );
  private readonly realEstateService = inject(RealEstateService);
  private readonly agentService = inject(AgentService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  regions$: Observable<Region[]> | undefined;
  agent$: Observable<Agent> | undefined;
  realEstate: any;
  realEstateid: number | undefined;
  regionId: number | undefined;
  responsiveOptions: any[] | undefined;
  products: RealEstate[] | undefined;

  goBack() {
    this.router.navigate(['/home-page/']);
  }

  openDialog(id: number): void {
    const dialogRef = this.dialog.open(DeleteListingDialogComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(['/home-page/']);
        this.realEstateService.deleteRealEstate(id).subscribe(
          (response) => {
            console.log('Success:', response);
          },
          (error) => {
            console.error('Error:', error);
            if (error.status === 422) {
              console.log('Validation errors:', error.error.errors);
            }
          }
        );
      }
    });
  }

  goToDetailsPage(id: number | undefined | null) {
    if (id)
      this.realEstateService.getRealEstatesById(id).subscribe((data) => {
        this.realEstate = data;
        this.regionId = data.city.region_id;
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.realEstateid = params['id'];
    });

    this.agent$ = this.agentService
      .getAgents()
      .pipe(find((agent) => agent.id === this.realEstateid));

    if (this.realEstateid)
      this.realEstateService
        .getRealEstatesById(this.realEstateid)
        .subscribe((data) => {
          this.realEstate = data;
          this.regionId = data.city.region_id;
        });

    this.realEstateService.getRealEstates().subscribe((realEstate) => {
      this.products = realEstate.filter(
        (product: any) => product.city.region_id == this.regionId
      );
    });

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'warning';
    }
  }
}
