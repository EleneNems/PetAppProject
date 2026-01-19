import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { LoadingSpinner } from '../../../loading-spinner/loading-spinner';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.html',
  styleUrls: ['./add-pet.css'],
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinner],
})

export class AddPetComponent implements OnInit {
  petForm: FormGroup;
  selectedFile: File | null = null;
  message = '';
  pets: any[] = [];
  editingPet: any = null;
  loading = false;

  showDeleteModal = false;
  petToDeleteId: number | null = null;

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    this.loading = true;
    this.adminService.getPets().subscribe({
      next: res => {
        this.pets = res;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitPet() {
    if (!this.petForm.valid || !this.selectedFile) {
      this.message = 'Please fill all fields and select an image.';
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.petForm.value.name);
    formData.append('species', this.petForm.value.species);
    formData.append('image', this.selectedFile);

    this.adminService.uploadPet(formData).subscribe({
      next: res => {
        this.message = 'Pet uploaded successfully!';
        this.petForm.reset();
        this.selectedFile = null;
        this.loading = false;
        this.loadPets();
        
        // Clear message after 3 seconds
        setTimeout(() => this.message = '', 3000);
      },
      error: err => {
        console.error(err);
        this.message = 'Failed to upload pet.';
        this.loading = false;
      }
    });
  }

  editPet(pet: any) {
    this.editingPet = pet;
    this.petForm.patchValue({
      name: pet.name,
      species: pet.species
    });
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updatePet() {
    if (!this.editingPet) return;

    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.petForm.value.name);
    formData.append('species', this.petForm.value.species);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.adminService.updatePet(this.editingPet.id, formData).subscribe({
      next: () => {
        this.message = 'Pet updated successfully!';
        this.editingPet = null;
        this.petForm.reset();
        this.selectedFile = null;
        this.loading = false;
        this.loadPets();
        
        // Clear message after 3 seconds
        setTimeout(() => this.message = '', 3000);
      },
      error: err => {
        console.error(err);
        this.message = 'Failed to update pet.';
        this.loading = false;
      }
    });
  }

  cancelEdit() {
    this.editingPet = null;
    this.petForm.reset();
    this.selectedFile = null;
    this.message = '';
  }

  confirmDelete(id: number) {
    this.petToDeleteId = id;
    this.showDeleteModal = true;
  }

  deleteConfirmed() {
    if (this.petToDeleteId === null) return;

    this.loading = true;
    this.adminService.deletePet(this.petToDeleteId).subscribe({
      next: () => {
        this.loadPets();
        this.showDeleteModal = false;
        this.petToDeleteId = null;
        this.message = 'Pet deleted successfully!';
        
        // Clear message after 3 seconds
        setTimeout(() => this.message = '', 3000);
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.showDeleteModal = false;
        this.message = 'Failed to delete pet.';
      }
    });
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.petToDeleteId = null;
  }
}