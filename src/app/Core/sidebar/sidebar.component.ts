import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isExpanded = false;
  hideSidebar = false;

  activeSection: string = '';


  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.hideSidebar = event.urlAfterRedirects.includes('/welcome');
      });
  }

  setActive(section: string) {
  this.activeSection = section;
}
  navigateWithFragment(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }
}
