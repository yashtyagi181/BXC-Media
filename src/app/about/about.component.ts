import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit, OnDestroy {

  @ViewChild('aboutHero') aboutHero!: ElementRef;
  @ViewChild('mission') mission!: ElementRef;
  @ViewChild('vision') vision!: ElementRef;
  @ViewChild('problem') problem!: ElementRef;
  @ViewChild('how') how!: ElementRef;
  @ViewChild('statsSection') statsSection!: ElementRef;
  @ViewChild('whySection') whySection!: ElementRef;

  private ctx!: gsap.Context;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {

    this.ctx = gsap.context(() => {

      // ===============================
      // ABOUT HERO
      // ===============================
      gsap.from(this.aboutHero.nativeElement.children, {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });

      // ===============================
      // MISSION & VISION (Opposite Directions)
      // ===============================
      gsap.fromTo(
        [this.mission.nativeElement, this.vision.nativeElement],
        {
          y: 80,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: this.mission.nativeElement,
            start: "top 80%",
            toggleActions: "restart none restart none"
          }
        }
      );

      // 🔥 Subtle 3D Tilt Effect
        [this.mission.nativeElement, this.vision.nativeElement].forEach(card => {

          const maxRotation = 8;

          card.addEventListener('mousemove', (e: MouseEvent) => {

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = ((y / rect.height) - 0.5) * -maxRotation;
            const rotateY = ((x / rect.width) - 0.5) * maxRotation;

            gsap.to(card, {
              rotationX: rotateX,
              rotationY: rotateY,
              transformPerspective: 800,
              transformOrigin: "center",
              duration: 0.3,
              ease: "power2.out"
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              rotationX: 0,
              rotationY: 0,
              duration: 0.5,
              ease: "power3.out"
            });
          });

        });


      // ===============================
      // PROBLEM SECTION
      // ===============================
      gsap.from(this.problem.nativeElement.querySelectorAll("p"), {
        scrollTrigger: {
          trigger: this.problem.nativeElement,
          start: "top 75%",
          toggleActions: "restart none restart none"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });

      gsap.to(this.problem.nativeElement.querySelector(".bg-primary\\/5"), {
        scrollTrigger: {
          trigger: this.problem.nativeElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        },
        y: 120,
        ease: "none"
      });

      // ===============================
      // HOW SECTION TITLE
      // ===============================
      gsap.from(this.how.nativeElement, {
        scrollTrigger: {
          trigger: this.how.nativeElement,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.1,
        ease: "power3.out"
      });

      // ===============================
      // HOW CARDS
      // ===============================
      const howCards = this.el.nativeElement.querySelectorAll('.grid > div');

        howCards.forEach((card: HTMLElement) => {

          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -10,
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              duration: 0.3,
              ease: "power2.out"
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              boxShadow: "0 0px 0px rgba(0,0,0,0)",
              duration: 0.3,
              ease: "power2.out"
            });
          });

        });


      // ===============================
      // STATS COUNTER (GSAP version)
      // ===============================
      const counters = this.el.nativeElement.querySelectorAll('.counter');

      counters.forEach((counter: HTMLElement) => {
        const target = Number(counter.getAttribute('data-target'));

        ScrollTrigger.create({
          trigger: this.statsSection.nativeElement,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              innerText: target,
              duration: 2,
              snap: { innerText: 1 },
              ease: "power1.out",
              onUpdate: function () {
                const value = Math.ceil(Number(counter.innerText));
                if (target >= 1000) {
                  counter.innerText = (value / 1000).toFixed(1).replace('.0','') + "K+";
                } else {
                  counter.innerText = value + "+";
                }
              }
            });
          }
        });
      });

      gsap.from(this.whySection.nativeElement.querySelectorAll('.border-l-4'), {
        scrollTrigger: {
          trigger: this.whySection.nativeElement,
          start: "top 80%",
          toggleActions: "restart none restart none"
        },
        x: -60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });

    }, this.el.nativeElement);

    setTimeout(() => ScrollTrigger.refresh(), 200);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
