import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AgenrForm } from '../../api/model';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../api/services/agent.service';
import {
  fileSizeValidator,
  phoneNumberValidator,
  redberryEmailValidator,
} from '../../validators/validator';

@Component({
  selector: 'app-add-agent-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './add-agent-dialog.component.html',
  styleUrl: './add-agent-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAgentDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddAgentDialogComponent>);
  private readonly agentService = inject(AgentService);
  public imgSrc: WritableSignal<string | null> = signal(null);

  agentForm = new FormGroup<AgenrForm>({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    surname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      phoneNumberValidator(),
    ]),
    email: new FormControl('', [Validators.required, redberryEmailValidator()]),
    avatar: new FormControl(null, [Validators.required, fileSizeValidator(1)]),
  });

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.agentForm.get('avatar')?.setValue(file);

      const maxSize = 1 * 1024 * 1024; // 1MB in bytes
      if (file.size > maxSize) {
        alert('არ უნდა აღემატებოდეს 1mb-ის ზომაში');
        return;
      }
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        alert('არჩეული ფაილი არ არის image.');
        return;
      }

      // Read the file as Base64
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64Image = e.target?.result as string;

        this.imgSrc.set(base64Image);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteImage() {
    this.imgSrc.set(null);
    console.log('deleteImage_', this.imgSrc());
  }

  onSubmit() {
    if (this.agentForm.valid) {
      const agent = {
        name: this.agentForm.get('name')?.value,
        surname: this.agentForm.get('surname')?.value,
        phone: this.agentForm.get('phone')?.value ?? null,
        email: this.agentForm.get('email')?.value,
        avatar: this.agentForm.get('avatar')?.value,
      };

      // Send the formData to the backend
      if (agent)
        this.agentService.postAgent(agent).subscribe(
          (response) => {
            console.log('Success:', response);
            this.agentForm.reset();
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error:', error);
            if (error.status === 422) {
              console.log('Validation errors:', error.error.errors);
            }
          }
        );
    } else {
      console.log('Form is invalid', this.agentForm);
      this.agentForm.markAllAsTouched();
    }
  }
}
