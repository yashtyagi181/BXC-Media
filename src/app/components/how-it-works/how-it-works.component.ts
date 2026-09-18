import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss'],
})
export class HowItWorksComponent implements AfterViewInit {
  @ViewChild('introSection', { static: true }) introSection!: ElementRef;
  introVisible = false;
  introObserver!: IntersectionObserver;
  private hasAnimated = false;


  @ViewChildren('card', { read: ElementRef }) cards!: QueryList<ElementRef>;
  @ViewChild('section', { static: true }) sectionRef!: ElementRef;

  steps = [
    {
      number: '1',
      color: 'bg-yellow-300',
      video: 'https://atomikgrowth.com/wp-content/uploads/2023/09/Animation-1_update-1.mp4',
      frontText: 'Our Mission',
      backText: 'We <strong>analyze your market</strong> and <strong>ideal client</strong>, then craft a <strong>content strategy </strong>that positions you as the<strong> undeniable expert</strong>.',
      direction: 'left',
      tilt: 'tilt-left',
      marginTop: 'mt-0',
    },
    {
      number: '2',
      color: 'bg-purple-300',
      video: 'https://atomikgrowth.com/wp-content/uploads/2023/09/1Animaton-2_update.mp4',
      frontText: '',
      backText: '<strong>16+ high-converting videos per month</strong> — every one designed to <strong>build trust</strong>, <strong>boost engagement</strong>, and <strong>fill your pipeline with ready-to-buy leads</strong> ',
      direction: 'bottom',
      tilt: 'tilt-center',
      marginTop: 'mt-8',
    },
    {
      number: '3',
      color: 'bg-rose-300',
      video: 'https://atomikgrowth.com/wp-content/uploads/2023/09/Animation-3_update-1.mp4',
      backText: 'We <strong>script content</strong> that showcases your expertise and <strong>wins hearts through powerful storytelling</strong>.',
      direction: 'top',
      tilt: 'tilt-center',
      marginTop: 'mt-0',
    },
    {
      number: '4',
      color: 'bg-green-300',
      video: 'https://atomikgrowth.com/wp-content/uploads/2023/09/Animation-4_update.mp4',
      backText: 'Your content lives everywhere your clients are — <strong>LinkedIn, Instagram, TikTok, YouTube</strong>. We handle it all.',
      direction: 'right',
      tilt: 'tilt-right',
      marginTop: 'mt-8',
    }
  ];

  ngAfterViewInit() {
    // ------------------------------
    // Fade-in animation for intro section
    // ------------------------------
    this.introObserver = new IntersectionObserver(
      ([entry]) => {
        this.introVisible = entry.isIntersecting;
      },
      { threshold: 0.3 }
    );

    if (this.introSection?.nativeElement) {
      this.introObserver.observe(this.introSection.nativeElement);
    }
     // ------------------------------
    // Card animation logic
    // ------------------------------
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.cards.forEach((card, index) => {
            const direction = this.steps[index].direction;
            const el = card.nativeElement;

            el.classList.remove('opacity-0', `exit-to-${direction}`);
            // void el.offsetWidth;

            el.classList.add(`enter-from-${direction}`);

            el.classList.remove('tilt-left', 'tilt-center', 'tilt-right');
            setTimeout(() => {
              if (direction === 'left') el.classList.add('tilt-left');
              else if (direction === 'right') el.classList.add('tilt-right');
              else el.classList.add('tilt-center');
            }, 800);
          });
        } else {
          this.cards.forEach((card, index) => {
            const direction = this.steps[index].direction;
            const el = card.nativeElement;

            el.classList.remove(`enter-from-${direction}`, 'tilt-left', 'tilt-center', 'tilt-right');
            // void el.offsetWidth;

            el.classList.add(`exit-to-${direction}`);
          });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(this.sectionRef.nativeElement);
  }
}
