import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-case-studies-detailed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './case-studies-detailed.component.html',
  styleUrl: './case-studies-detailed.component.scss'
})
export class CaseStudiesDetailedComponent {
  slug = '';
  caseStudy: any = null;

  allCaseStudies: { [key: string]: any } = {
    "armin-shafee": {
      title: "Armin Shafee — High-Ticket Coach",
      industry: "Coaching • High-Ticket Sales",
      thumbnail: "/assets/case-studies/armin.jpg",
      overview: "Write your overview here...",
      challenges: [
        "Challenge 1...",
        "Challenge 2..."
      ],
      strategy: [
        "Strategy point 1...",
        "Strategy point 2..."
      ],
      execution: [
        "Execution point 1...",
        "Execution point 2..."
      ],
      results: [
        "20K → 100K+ followers",
        "5–8 weekly inbound leads"
      ],
      testimonial: "Client feedback goes here."
    },

    "desmond-acha": {
      title: "Desmond Acha — GovCon University",
      industry: "Government Contracting Education",
      thumbnail: "/assets/case-studies/desmond.jpg",
      overview: "Write overview here...",
      challenges: ["Challenge A", "Challenge B"],
      strategy: ["Strategy A", "Strategy B"],
      execution: ["Execution A", "Execution B"],
      results: ["7K → 30K followers", "12K+ YouTube subscribers"],
      testimonial: "Client testimonial here."
    }
  };

  constructor(private route: ActivatedRoute) {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.caseStudy = this.allCaseStudies[this.slug];
  }
}
