import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit, OnDestroy {

  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('heroTitle') heroTitle!: ElementRef;
  @ViewChild('heroSubtitle') heroSubtitle!: ElementRef;
  @ViewChild('heroButtons') heroButtons!: ElementRef;
  @ViewChild('heroStats') heroStats!: ElementRef;
  @ViewChild('sectionTwo') sectionTwo!: ElementRef;
  @ViewChild('threeContainer') threeContainer!: ElementRef;

  private ctx!: gsap.Context;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private particles!: THREE.Points;
  private animationId!: number;
  
  

  initThree() {
  const container = this.threeContainer.nativeElement;

  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  this.camera.position.z = 5;

  this.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  this.renderer.setSize(container.clientWidth, container.clientHeight);
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(this.renderer.domElement);

  // Particle geometry
  const particlesCount = 1000;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x8b5cf6, // subtle purple
    transparent: true,
    opacity: 0.8
  });

  this.particles = new THREE.Points(geometry, material);
  this.scene.add(this.particles);

  this.animateThree();

  window.addEventListener('resize', this.onResize);
}

  animateThree = () => {
    this.particles.rotation.y += 0.0008;
    this.particles.rotation.x += 0.0003;

    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.animateThree);
  };

  onResize = () => {
  const container = this.threeContainer.nativeElement;

  this.camera.aspect = container.clientWidth / container.clientHeight;
  this.camera.updateProjectionMatrix();

  this.renderer.setSize(container.clientWidth, container.clientHeight);
};


  ngAfterViewInit(): void {
  this.initThree();
  this.ctx = gsap.context(() => {

    // HERO INTRO
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(this.heroTitle.nativeElement.children, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15
    });

    tl.from(this.heroSubtitle.nativeElement, {
      y: 30,
      opacity: 0,
      duration: 0.6
    }, "-=0.4");

    tl.from(this.heroButtons.nativeElement, {
      y: 30,
      opacity: 0,
      duration: 0.6
    }, "-=0.4");

    tl.from(this.heroStats.nativeElement.children, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.15
    }, "-=0.3");


    // SECTION TWO ANIMATION
    gsap.from(this.sectionTwo.nativeElement.querySelector(".section-two-title"), {
      scrollTrigger: {
        trigger: this.sectionTwo.nativeElement,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 80,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(this.sectionTwo.nativeElement.querySelector(".section-two-text"), {
      scrollTrigger: {
        trigger: this.sectionTwo.nativeElement,
        start: "top 75%",
        toggleActions: "play none none reverse"
      },
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: "power3.out"
    });

    // HERO SCROLL FADE
    gsap.to(this.heroSection.nativeElement, {
      scrollTrigger: {
        trigger: this.heroSection.nativeElement,
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      opacity: 0.3,
      y: 100,
      ease: "none"
    });

  });

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 200);
}


  ngOnDestroy(): void {
  this.ctx?.revert();

  cancelAnimationFrame(this.animationId);

  window.removeEventListener('resize', this.onResize);

  this.renderer.dispose();
  this.scene.clear();
}


  bookCall() {
    window.open('https://calendly.com/yourusername/15min', '_blank');
  }
}
