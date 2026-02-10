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


// openEditModal(profile: Profile, index: number): void {
//   this.editableProfile = { ...profile };
//   this.editingIndex = index;
//   this.isModalOpen = true;
//   this.isEditing = true;
// }

openEditModal(profile: Profile, index: number): void {
  this.editableProfile = {
    ...profile,
    isSystem: profile.isSystem === true // 👈 normalize
  };

  this.editingIndex = index;
  this.isModalOpen = true;
  this.isEditing = true;
}




// addProfile(): void {
//   const newId = this.profiles.length
//     ? Math.max(...this.profiles.map(p => p.id)) + 1
//     : 1;

//   this.editableProfile = {
//     id: newId,
//     name: '',
//     image: 'assets/profiles/default.png',
//     isKids: false // default = Home
//   };

//   this.isModalOpen = true;
//   this.isEditing = false;
// }


addProfile(): void {
  const newId = this.profiles.length
    ? Math.max(...this.profiles.map(p => p.id)) + 1
    : 1;

  this.editableProfile = {
    id: newId,
    name: '',
    image: '',      // 👈 empty string = letter avatar
    isKids: false
  };

  this.isModalOpen = true;
  this.isEditing = false;
}



removeAvatar(): void {
  this.editableProfile.image = '';
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

// closeModal(): void {
//   this.isModalOpen = false;
//   this.editableProfile = { id: 0, name: '', image: '' };
//   this.isEditing = false;
// }



getAvatarColor(name: string | undefined): string {
  if (!name) return '#666';

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 45%)`;
}



closeModal(): void {
  this.isModalOpen = false;
  this.editableProfile = { id: 0, name: '', image: '' };
  this.isEditing = false;
  this.editingIndex = null;
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
