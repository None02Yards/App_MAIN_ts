import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, Profile } from 'src/app/Services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profiles: Profile[] = [];

  constructor(
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.profiles$.subscribe(updated => {
      console.log("UPDATED PROFILES:", updated);
      this.profiles = updated;
    });
  }

  // goToProfile(profile: string): void {
  //   if (profile === 'zu') {
  //     this.router.navigate(['/home']);
  //   } else if (profile.toLowerCase() === 'kids') {
  //     this.router.navigate(['/kids']);
  //   }
  // }

  goToProfile(profile: Profile): void {
  if (profile.isKids) {
    this.router.navigate(['/kids']);
  } else {
    this.router.navigate(['/home']);
  }
}



getAvatarColor(name: string | undefined): string {
  if (!name) return '#666';

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 45%)`;
}


  goToManageProfiles(): void {
    this.router.navigate(['/manage-profiles']);
  }
}
