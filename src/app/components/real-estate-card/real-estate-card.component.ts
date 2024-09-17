import { Component, Input } from '@angular/core';
import { RealEstate } from '../../api/model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-real-estate-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './real-estate-card.component.html',
  styleUrl: './real-estate-card.component.scss',
})
export class RealEstateCardComponent {
  @Input() realEstate: RealEstate | undefined;
}
