import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  footerLinks = {
    // services: [
    //   { label: 'Podcast Launch', href: '#launch' },
    //   { label: 'Podcast Scale', href: '#scale' },
    //   { label: 'Content Strategy', href: '#strategy' },
    //   { label: 'Distribution', href: '#distribution' }
    // ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Case Studies', href: '#case-studies' },
      // { label: 'Blog', href: '#blog' },
      // { label: 'Careers', href: '#careers' }
    ],
    // resources: [
    //   { label: 'Podcast Guide', href: '#guide' },
    //   { label: 'Best Practices', href: '#practices' },
    //   { label: 'Industry Reports', href: '#reports' },
    //   { label: 'Templates', href: '#templates' }
    // ]
  };

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  bookCall() {
  window.open('https://calendly.com/yourusername/15min', '_blank');
}

}
