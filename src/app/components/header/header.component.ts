import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true, // ✅ Required for standalone components
  imports: [CommonModule, RouterModule, LucideAngularModule], // ✅ Add this
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] // We'll fix the missing file next
})
export class HeaderComponent {
  isMenuOpen = false;
  navItems = [
    { label: 'HOME', link: '/'},
    { label: 'PROJECTS', link: '/projects' },
    { label: 'ABOUT US', link: '/about-us' },
    { label: 'CASE STUDIES', link: '/case-studies' },
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  bookCall() {
  window.open('https://calendly.com/yourusername/15min', '_blank');
}

}
