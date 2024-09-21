import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RealEstate, Region } from '../../api/model';
import { GeographicalInformationService } from '../../api/services/geographical-information.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RealEstateCardComponent } from '../../components/real-estate-card/real-estate-card.component';
import { RealEstateService } from '../../api/services/real-estates.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddAgentDialogComponent } from '../../components/add-agent-dialog/add-agent-dialog.component';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    ReactiveFormsModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private readonly geographicalInformationService = inject(
    GeographicalInformationService
  );
  private readonly realEstateService = inject(RealEstateService);
  private readonly router = inject(Router);
  readonly dialog = inject(MatDialog);
  public regions = false;
  public area = false;
  public priceCategory = false;
  public numberOfBedrooms = false;
  public regions$: Observable<Region[]> | undefined;
  realEstates$: Observable<RealEstate[]> | undefined;
  filterBy: string[] = [];

  filterForm: FormGroup = new FormGroup({
    region: new FormControl(''),
    numberOfBedrooms: new FormControl(''),
    minArea: new FormControl(''),
    maxArea: new FormControl(''),
  });

  openDialog(): void {
    this.dialog.open(AddAgentDialogComponent, {
      width: '1000px',
      autoFocus: false,
    });
  }
  minArea = [50, 100, 150, 200, 250];
  maxArea = [100, 150, 200, 250, 300];
  goToDetailsPage(id: number | undefined | null) {
    this.router.navigate(['/Listing-page/'], {
      queryParams: { id: id },
    });
  }

  @ViewChild('region') regionDiv!: ElementRef;
  @ViewChild('priceCategory') priceCategoryDiv!: ElementRef;
  @ViewChild('area') areaDiv!: ElementRef;
  @ViewChild('numberOfBedrooms') numberOfBedroomsDiv!: ElementRef;

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    let clickedInsideRegionDiv = true;
    if (this.regionDiv) {
      clickedInsideRegionDiv = this.regionDiv.nativeElement.contains(
        event.target
      );
    }
    let clickedpriceCategoryDiv = true;
    if (this.priceCategoryDiv) {
      clickedpriceCategoryDiv = this.priceCategoryDiv.nativeElement.contains(
        event.target
      );
    }
    let clickedareaDiv = true;
    if (this.areaDiv) {
      clickedareaDiv = this.areaDiv.nativeElement.contains(event.target);
    }
    let numberOfBedroomsDiv = true;
    if (this.numberOfBedroomsDiv) {
      numberOfBedroomsDiv = this.numberOfBedroomsDiv.nativeElement.contains(
        event.target
      );
    }
    if (
      !clickedInsideRegionDiv ||
      !clickedpriceCategoryDiv ||
      !clickedareaDiv ||
      !numberOfBedroomsDiv
    ) {
      this.closeDropdown();
    }
  }

  closeDropdown() {
    this.regions = false;
    this.priceCategory = false;
    this.area = false;
    this.numberOfBedrooms = false;
  }

  divClicked(event: MouseEvent) {
    event.stopPropagation();
  }

  onSubmit(): void {
    this.closeDropdown();

    if (
      this.filterForm.get('minArea')?.value &&
      this.filterForm.get('maxArea')?.value
    ) {
      this.filterBy.push(
        `${this.filterForm.get('minArea')?.value}-${
          this.filterForm.get('maxArea')?.value
        }`
      );
      this.realEstates$ = this.realEstates$?.pipe(
        map((realEstates) => {
          return realEstates.filter((el) => {
            return el?.area
              ? this.filterForm.get('maxArea')?.value <
                  el?.area >
                  this.filterForm.get('minArea')?.value
              : null;
          });
        })
      );
    } else if (this.filterForm.get('minArea')?.value) {
      this.filterBy.push(this.filterForm.get('minArea')?.value as string);
      this.realEstates$ = this.realEstates$?.pipe(
        map((realEstates) => {
          return realEstates.filter((el) => {
            return el?.area
              ? el?.area > this.filterForm.get('minArea')?.value
              : null;
          });
        })
      );
    } else if (this.filterForm.get('maxArea')?.value) {
      this.filterBy.push(this.filterForm.get('maxArea')?.value as string);
      this.realEstates$ = this.realEstates$?.pipe(
        map((realEstates) => {
          return realEstates.filter((el) => {
            return el?.area
              ? el?.area < this.filterForm.get('maxArea')?.value
              : null;
          });
        })
      );
    }

    if (this.filterForm.get('region')?.value) {
      this.filterBy.push(this.filterForm.get('region')?.value as string);
      this.realEstates$ = this.realEstates$?.pipe(
        map((realEstates) => {
          return realEstates.filter((el) => {
            return el.city.region?.name == this.filterForm.get('region')?.value;
          });
        })
      );
    }
    if (this.filterForm.get('numberOfBedrooms')?.value) {
      this.filterBy.push(
        this.filterForm.get('numberOfBedrooms')?.value as string
      );
      this.realEstates$ = this.realEstates$?.pipe(
        map((realEstates) => {
          return realEstates.filter((el) => {
            return (
              el.bedrooms == this.filterForm.get('numberOfBedrooms')?.value
            );
          });
        })
      );
    }
  }
  cancelFilter(item: string) {
    this.filterBy = this.filterBy.filter((el) => el !== item);
  }
  ngOnInit(): void {
    this.regions$ = this.geographicalInformationService.getRegions();
    this.realEstates$ = this.realEstateService.getRealEstates();
  }
}
