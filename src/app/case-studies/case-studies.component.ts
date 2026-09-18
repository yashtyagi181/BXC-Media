import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-case-studies',

  standalone: true,

  imports: [CommonModule, RouterModule],

  templateUrl: './case-studies.component.html',

  styleUrl: './case-studies.component.scss',
})
export class CaseStudiesComponent implements AfterViewInit, OnDestroy {
  private ctx!: gsap.Context;

  caseStudies = [
    {
      title: 'Armin Shafee — High-Ticket Coach',

      slug: 'armin-shafee',

      thumbnail: 'assets/case-studies/armin.jpg',

      shortDescription:
        'Scaled authority, generated consistent inbound leads and positioned the brand as a premium coaching authority.',
    },

    {
      title: 'Desmond Acha — GovCon University',

      slug: 'desmond-acha',

      thumbnail: 'assets/case-studies/desmond.jpg',

      shortDescription:
        'Built a powerful personal brand ecosystem and increased audience trust through strategic content.',
    },

    {
      title: 'Future Success Story',

      slug: 'client-3',

      thumbnail: 'assets/case-studies/client3.jpg',

      shortDescription: 'A new transformation story coming soon.',
    },
  ];

  constructor(
    private router: Router,
    private el: ElementRef,
  ) {}

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      /*
      ====================================
      HERO INTRO
      ====================================
      */

      const heroTimeline = gsap.timeline();

      heroTimeline
        .from('.eyebrow', {
          y: 40,

          opacity: 0,

          duration: 0.8,

          ease: 'power3.out',
        })

        .from(
          '.hero-title',
          {
            y: 80,

            opacity: 0,

            duration: 1,

            ease: 'power4.out',
          },

          '-=.4',
        )

        .from(
          '.hero-description',
          {
            y: 40,

            opacity: 0,

            duration: 0.8,

            ease: 'power3.out',
          },

          '-=.5',
        );

      /*
      ====================================
      CASE STUDY REVEAL
      ====================================
      */

      const cases = this.el.nativeElement.querySelectorAll('.case-study');

      cases.forEach((card: any) => {
        const image = card.querySelector('.case-image-wrapper');

        const content = card.querySelector('.case-content');

        gsap.from(card, {
          scrollTrigger: {
            trigger: card,

            start: 'top 75%',

            toggleActions: 'play none none reverse',
          },

          y: 100,

          opacity: 0,

          duration: 1,

          ease: 'power3.out',
        });

        /*
        IMAGE PARALLAX
        */

        gsap.to(image, {
          scrollTrigger: {
            trigger: card,

            start: 'top bottom',

            end: 'bottom top',

            scrub: true,
          },

          y: -50,

          ease: 'none',
        });

        /*
        CONTENT FLOAT
        */

        gsap.from(content.children, {
          scrollTrigger: {
            trigger: card,

            start: 'top 70%',
          },

          y: 40,

          opacity: 0,

          stagger: 0.12,

          duration: 0.8,

          ease: 'power3.out',
        });
      });

      /*
      ====================================
      PROCESS SECTION
      ====================================
      */

      gsap.from('.process-card', {
        scrollTrigger: {
          trigger: '.process-section',

          start: 'top 75%',
        },

        y: 60,

        opacity: 0,

        stagger: 0.15,

        duration: 0.8,

        ease: 'power3.out',
      });

      /*
      ====================================
      CTA
      ====================================
      */

      gsap.from('.cta-box', {
        scrollTrigger: {
          trigger: '.cta-section',

          start: 'top 80%',
        },

        scale: 0.9,

        opacity: 0,

        duration: 1,

        ease: 'power3.out',
      });

      /*
      ====================================
      REFRESH
      ====================================
      */

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    });
  }

  openCaseStudy(slug: string) {
    this.router.navigate(['/case-studies-detailed', slug]);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
