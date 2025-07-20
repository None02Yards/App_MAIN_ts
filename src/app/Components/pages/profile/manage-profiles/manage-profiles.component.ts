import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, Profile } from 'src/app/Services/profile.service';

@Component({
  selector: 'app-manage-profiles',
  templateUrl: './manage-profiles.component.html',
  styleUrls: ['./manage-profiles.component.scss']
})
export class ManageProfilesComponent implements OnInit {

  profiles: Profile[] = [];
  isModalOpen = false;
editableProfile: Profile = { id: 0, name: '', image: '' };
  isEditing = false;
  editingIndex: number | null = null; // ✅ Declare it here

  constructor(
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.profiles$.subscribe(profiles => {
      this.profiles = profiles;
    });
  }

 goBack(): void {
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/profile']);
  });
}


openEditModal(profile: Profile, index: number): void {
  this.editableProfile = { ...profile };
  this.editingIndex = index;
  this.isModalOpen = true;
  this.isEditing = true;
}


  addProfile(): void {
  const newId = this.profiles.length ? Math.max(...this.profiles.map(p => p.id)) + 1 : 1;
  this.editableProfile = { id: newId, name: '', image: 'assets/profiles/default.png' };
  this.isModalOpen = true;
  this.isEditing = false;
}


  saveChanges(): void {
    if (this.isEditing) {
      this.profileService.updateProfile(this.editableProfile);
    } else {
      this.profileService.addProfile(this.editableProfile);
    }
    this.closeModal();
  }

  deleteProfile(profile: Profile): void {
    this.profileService.deleteProfile(profile);
  }

closeModal(): void {
  this.isModalOpen = false;
  this.editableProfile = { id: 0, name: '', image: '' };
  this.isEditing = false;
}

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.editableProfile.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  
}
