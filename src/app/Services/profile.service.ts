

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Profile {
  id: number;
  name: string;
  image: string;
  isKids?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private storageKey = 'userProfiles';

  private defaultProfiles: Profile[] = [
    { id: 1, name: 'zu', image: 'assets/icons/Zulogo.png' },
    { id: 2, name: 'Kids', image: 'assets/icons/logokids.jpg', isKids: true }
  ];

  private profiles: Profile[] = this.loadProfiles();
  private profilesSubject = new BehaviorSubject<Profile[]>(this.profiles);
  profiles$ = this.profilesSubject.asObservable();

  // Load from localStorage or fallback
  private loadProfiles(): Profile[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : this.defaultProfiles;
  }

  // Save current profiles to localStorage
  private saveProfiles(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.profiles));
  }

  // Public: get current profiles (non-reactive)
  getProfiles(): Profile[] {
    return [...this.profiles];
  }

  updateProfiles(updated: Profile[]) {
    this.profiles = [...updated];
    this.profilesSubject.next(this.profiles);
    this.saveProfiles();
  }

  updateProfile(updatedProfile: Profile) {
    const index = this.profiles.findIndex(p => p.id === updatedProfile.id);
    if (index !== -1) {
      this.profiles[index] = updatedProfile;
      this.profilesSubject.next([...this.profiles]);
      this.saveProfiles();
    }
  }

  deleteProfile(profile: Profile) {
    this.profiles = this.profiles.filter(p => p.id !== profile.id);
    this.profilesSubject.next([...this.profiles]);
    this.saveProfiles();
  }

  addProfile(profile: Profile) {
    this.profiles.push(profile);
    this.profilesSubject.next([...this.profiles]);
    this.saveProfiles();
  }
}
