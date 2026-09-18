import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component'; // Make sure path is correct
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from "./components/hero/hero.component";
import { PortfolioClientsComponent } from "./components/portfolio-clients/portfolio-clients.component";
import { TestimonialsComponent } from "./components/testimonials/testimonials.component";
import { HowItWorksComponent } from "./components/how-it-works/how-it-works.component";
import { VideoPhonesComponent } from "./components/video-phones/video-phones.component";

@Component({
  selector: 'app-root',
  standalone: true, // ✅ This is required for standalone components
  imports: [HeaderComponent, FooterComponent, RouterOutlet, HeroComponent, PortfolioClientsComponent, TestimonialsComponent, HowItWorksComponent, VideoPhonesComponent], // ✅ Import the components you use in template
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // ✅ Correct is "styleUrls" (plural)
})
export class AppComponent {
  title = 'bxcmedia';
}
