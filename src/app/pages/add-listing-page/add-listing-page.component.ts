import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { map, Observable } from 'rxjs';
import {
  Agent,
  City,
  NewRealEstate,
  RealEstateForm,
  Region,
} from '../../api/model';
import { GeographicalInformationService } from '../../api/services/geographical-information.service';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../api/services/agent.service';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { RealEstateService } from '../../api/services/real-estates.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddAgentDialogComponent } from '../../components/add-agent-dialog/add-agent-dialog.component';
import {
  fileSizeValidator,
  minWordsValidator,
} from '../../validators/validator';

@Component({
  selector: 'app-add-listing-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatCheckboxModule,
    FormsModule,
    MatRadioModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatExpansionModule,
    MatDialogModule,
  ],
  templateUrl: './add-listing-page.component.html',
  styleUrl: './add-listing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddListingPageComponent implements OnInit {
  private readonly geographicalInformationService = inject(
    GeographicalInformationService
  );
  private readonly agentService = inject(AgentService);
  private readonly realEstateService = inject(RealEstateService);
  private router = inject(Router);
  readonly dialog = inject(MatDialog);
  readonly panelOpenState = signal(false);
  regions$: Observable<Region[]> | undefined;
  cities$: Observable<City[]> | undefined;
  agents$: Observable<Agent[]> | undefined;
  public imgSrc: WritableSignal<string | null> = signal(null);
  public listingFormCityEnable = false;
  private localStorageKey = 'listingFormData';

  listingForm = new FormGroup<RealEstateForm>({
    is_rental: new FormControl('0', Validators.required),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    zip_code: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    region: new FormControl(null, Validators.required),
    city: new FormControl(null, Validators.required),
    price: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
    ]),
    area: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
    ]),
    bedrooms: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    description: new FormControl(null, [
      Validators.required,
      minWordsValidator(5),
    ]),
    image: new FormControl(null, [Validators.required, fileSizeValidator(1)]),
    agent: new FormControl(null, Validators.required),
  });

  closeChooseAgent() {
    this.panelOpenState.set(false);
  }

  getCities(regionId: string) {
    this.cities$ = this.geographicalInformationService
      .getCities()
      .pipe(
        map((cities) =>
          cities.filter((city: City) => city.region_id == regionId)
        )
      );
  }

  cancelAddListing() {
    this.listingForm.reset();
    localStorage.removeItem(this.localStorageKey);
    localStorage.removeItem('listingImage');
    this.router.navigate(['/home-page/']);
  }

  private base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);

    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  compareRegion(region1: Region, region2: Region): boolean {
    return region1 && region2 ? region1.id === region2.id : region1 === region2;
  }

  compareCity = (city1: City, city2: City): boolean => {
    return city1 && city2 ? city1.id === city2.id : city1 === city2;
  };

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.listingForm.get('image')?.setValue(file);

      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        alert('The selected file is not an image.');
        return;
      }

      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('The image file must not be greater than 1MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64Image = e.target?.result as string;
        this.imgSrc.set(base64Image);
        localStorage.setItem('listingImage', base64Image);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteImage() {
    this.imgSrc.set(null);
    localStorage.removeItem('listingImage');
  }

  onSubmit() {
    if (this.listingForm.valid) {
      const realEstate: NewRealEstate = {
        address: this.listingForm.get('address')?.value,
        region_id: this.listingForm.get('region')?.value?.id ?? null,
        description: this.listingForm.get('description')?.value,
        city_id: this.listingForm.get('city')?.value?.id ?? null,
        zip_code: this.listingForm.get('zip_code')?.value,
        price: parseFloat(this.listingForm.get('price')?.value ?? '0'),
        area: parseFloat(this.listingForm.get('area')?.value ?? '0'),
        bedrooms: parseInt(this.listingForm.get('bedrooms')?.value ?? '0', 10),
        is_rental: this.listingForm.get('is_rental')?.value ?? '0',

        agent_id: this.listingForm.get('agent')?.value?.id ?? null,
        image: this.listingForm.get('image')?.value,
      };

      this.realEstateService.postRealEstates(realEstate).subscribe(
        (response) => {
          console.log('Success:', response);
          this.listingForm.reset();
          this.router.navigate(['/home-page/']);
          localStorage.removeItem(this.localStorageKey);
          localStorage.removeItem('listingImage');
        },
        (error) => {
          console.error('Error:', error);
          if (error.status === 422) {
            console.log('Validation errors:', error.error.errors);
          }
        }
      );
    } else {
      this.listingForm.markAllAsTouched();
    }
  }

  openDialog(): void {
    this.closeChooseAgent();
    const dialogRef = this.dialog.open(AddAgentDialogComponent, {
      width: '1000px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.agents$ = this.agentService.getAgents();
      }
    });
  }

  ngOnInit(): void {
    this.regions$ = this.geographicalInformationService.getRegions();
    this.agents$ = this.agentService.getAgents();

    const savedImage = localStorage.getItem('listingImage');
    if (savedImage) {
      const filename = 'image.png';
      const file = this.base64ToFile(savedImage, filename);

      this.listingForm.get('image')?.setErrors(null);
      this.listingForm.get('image')?.setValue(file);
      this.imgSrc.set(savedImage);
    }

    const savedFormData = localStorage.getItem(this.localStorageKey);

    if (savedFormData) {
      const parsedFormData = JSON.parse(savedFormData);

      this.listingForm.patchValue(parsedFormData);

      if (parsedFormData.region) {
        this.regions$?.subscribe((regions) => {
          const selectedRegion = regions.find(
            (region) => region.id === parsedFormData.region.id
          );
          if (selectedRegion) {
            this.listingForm.get('region')?.setValue(selectedRegion);

            if (selectedRegion.id) this.getCities(selectedRegion.id);

            this.cities$?.subscribe((cities) => {
              const selectedCity = cities.find(
                (city) => city.id === parsedFormData.city?.id
              );
              if (selectedCity) {
                this.listingForm.get('city')?.setValue(selectedCity);
              }
            });
          }
        });
      }
    }

    this.listingForm.valueChanges.subscribe((formData) => {
      localStorage.setItem(this.localStorageKey, JSON.stringify(formData));
    });

    this.listingForm.get('region')?.valueChanges.subscribe((region) => {
      if (region?.id) {
        this.listingFormCityEnable = true;
        this.getCities(region.id);
      } else {
        this.listingFormCityEnable = false;
      }
    });
  }
}
