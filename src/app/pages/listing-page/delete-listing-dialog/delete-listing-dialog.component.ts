import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-listing-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './delete-listing-dialog.component.html',
  styleUrl: './delete-listing-dialog.component.scss',
})
export class DeleteListingDialogComponent {}
