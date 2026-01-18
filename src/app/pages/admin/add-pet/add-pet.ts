import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.html',
  styleUrls: ['./add-pet.css'],
  imports: [CommonModule, ReactiveFormsModule],
})

export class AddPetComponent {
  petForm: FormGroup;
  selectedFile: File | null = null;
  message = '';

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitPet() {
    if (!this.petForm.valid || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('name', this.petForm.value.name);
    formData.append('species', this.petForm.value.species);
    formData.append('image', this.selectedFile);

    this.adminService.uploadPet(formData).subscribe({
      next: res => {
        this.message = 'Pet uploaded successfully!';
        this.petForm.reset();
        this.selectedFile = null;
      },
      error: err => {
        console.error(err);
        this.message = 'Failed to upload pet.';
      }
    });
  }
}
