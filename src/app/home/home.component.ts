import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../components/hero/hero.component';
import { PortfolioClientsComponent } from '../components/portfolio-clients/portfolio-clients.component';
import { HowItWorksComponent } from '../components/how-it-works/how-it-works.component';
import { VideoPhonesComponent } from '../components/video-phones/video-phones.component';
import { TestimonialsComponent } from '../components/testimonials/testimonials.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    PortfolioClientsComponent,
    HowItWorksComponent,
    VideoPhonesComponent,
    TestimonialsComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
