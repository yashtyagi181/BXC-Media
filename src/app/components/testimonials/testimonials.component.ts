import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  HostListener,
} from '@angular/core';

interface Testimonial {
  videoId: string;
  isShort: boolean;
  playing: boolean;
  muted: boolean;
  progress: number;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
})
export class TestimonialsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('introSection')
  introSection!: ElementRef;

  @ViewChild('deckSection')
  deckSection!: ElementRef;

  @ViewChildren('videoPlayer')
  videoPlayers!: QueryList<ElementRef<HTMLDivElement>>;

  introVisible = false;

  deckVisible = false;

  touchStartX = 0;
  touchEndX = 0;

  currentIndex = 0;

  userMuted = true;

  duplicatedImages: string[] = [];

  testimonials: Testimonial[] = [
    {
      videoId: 'wKUmvyBOZNo',
      isShort: false,
      playing: false,
      muted: true,
      progress: 0,
    },
    {
      videoId: 'A4LZ6eMXeK8',
      isShort: false,
      playing: false,
      muted: true,
      progress: 0,
    },
    {
      videoId: 'BVWZ-kUfj0k',
      isShort: false,
      playing: false,
      muted: true,
      progress: 0,
    },
    {
      videoId: 'uDKkwLUFpQU',
      isShort: false,
      playing: false,
      muted: true,
      progress: 0,
    },
    {
      videoId: 'wx43OkPlwQs',
      isShort: true,
      playing: false,
      muted: true,
      progress: 0,
    },
    {
      videoId: 'eooAvsNYhFs',
      isShort: true,
      playing: false,
      muted: true,
      progress: 0,
    },
  ];

  private players: any[] = [];

  private youtubeApiPromise?: Promise<void>;

  private progressTimers: any[] = [];

  private deckObserver?: IntersectionObserver;

  changing = false;

  ngOnInit(): void {
    this.duplicatedImages = [
      ...this.testimonialImages,
      ...this.testimonialImages,
    ];

    const observer = new IntersectionObserver(
      ([entry]) => {
        this.introVisible = entry.isIntersecting;
      },
      {
        threshold: 0.3,
      },
    );

    setTimeout(() => {
      if (this.introSection) {
        observer.observe(this.introSection.nativeElement);
      }
    }, 300);
  }

  testimonialImages: string[] = [
    'assets/photos/Testimonial/scroll strip/1.png',
    'assets/photos/Testimonial/scroll strip/2.png',
    'assets/photos/Testimonial/scroll strip/3.png',
    'assets/photos/Testimonial/scroll strip/4.png',
    'assets/photos/Testimonial/scroll strip/5.png',
    'assets/photos/Testimonial/scroll strip/6.png',
    'assets/photos/Testimonial/scroll strip/7.png',
    'assets/photos/Testimonial/scroll strip/8.png',
    'assets/photos/Testimonial/scroll strip/9.png',
    'assets/photos/Testimonial/scroll strip/10.png',
    'assets/photos/Testimonial/scroll strip/11.png',
    'assets/photos/Testimonial/scroll strip/12.png',
    'assets/photos/Testimonial/scroll strip/13.png',
  ];

  ngAfterViewInit(): void {
    /*
     * Load YouTube API.
     */
    this.loadYouTubeAPI().then(() => {
      this.createPlayers();
    });

    /*
     * Watch the deck visibility.
     */
    this.deckObserver = new IntersectionObserver(
      ([entry]) => {
        this.deckVisible = entry.isIntersecting;

        /*
         * Don't play videos just because
         * the section became visible.
         *
         * User must press play.
         */
        if (!this.deckVisible) {
          this.pauseAll();
        } else {
          this.playCenter();
        }
      },
      {
        threshold: 0.4,
      },
    );

    setTimeout(() => {
      if (this.deckSection) {
        this.deckObserver?.observe(this.deckSection.nativeElement);
      }
    }, 500);
  }

  /*
   * ----------------------------------------
   * YOUTUBE API
   * ----------------------------------------
   */

  private loadYouTubeAPI(): Promise<void> {
    if (window.YT?.Player) {
      return Promise.resolve();
    }

    if (this.youtubeApiPromise) {
      return this.youtubeApiPromise;
    }

    this.youtubeApiPromise = new Promise<void>((resolve) => {
      const existing = document.getElementById('youtube-iframe-api');

      if (existing) {
        const check = () => {
          if (window.YT?.Player) {
            resolve();
          } else {
            setTimeout(check, 50);
          }
        };

        check();

        return;
      }

      window.onYouTubeIframeAPIReady = () => {
        resolve();
      };

      const script = document.createElement('script');

      script.id = 'youtube-iframe-api';

      script.src = 'https://www.youtube.com/iframe_api';

      document.head.appendChild(script);
    });

    return this.youtubeApiPromise;
  }

  private createPlayers(): void {
    const containers = this.videoPlayers.toArray();

    containers.forEach((container, index) => {
      if (this.players[index]) {
        return;
      }

      const player = new window.YT.Player(container.nativeElement, {
        videoId: this.testimonials[index].videoId,

        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
          loop: 1,
          playlist: this.testimonials[index].videoId,
        },

        events: {
          onReady: () => {
            /*
             * Always start muted.
             * This allows autoplay to work reliably.
             */
            player.mute();

            this.testimonials[index].muted = true;

            this.startProgressTracking(index);

            /*
             * If this is the currently centered card
             * and the deck is already visible, start it.
             */
            if (index === this.currentIndex && this.deckVisible) {
              this.playCenter();
            }
          },

          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              this.testimonials[index].playing = true;
            }

            if (event.data === window.YT.PlayerState.PAUSED) {
              this.testimonials[index].playing = false;
            }

            if (event.data === window.YT.PlayerState.ENDED) {
              this.testimonials[index].playing = false;
              this.testimonials[index].progress = 0;

              /*
               * Loop only the centered testimonial.
               */
              if (index === this.currentIndex && this.deckVisible) {
                player.seekTo(0, true);
                player.playVideo();
              }
            }
          },
        },
      });

      this.players[index] = player;
    });
  }

  /*
   * ----------------------------------------
   * PLAYBACK
   * ----------------------------------------
   */

  playCenter(): void {
    const player = this.players[this.currentIndex];

    if (!player) {
      return;
    }

    /*
     * Pause every other testimonial.
     */
    this.players.forEach((otherPlayer, index) => {
      if (otherPlayer && index !== this.currentIndex) {
        otherPlayer.pauseVideo();
        this.testimonials[index].playing = false;
      }
    });

    /*
     * Apply the user's mute preference.
     */
    if (this.userMuted) {
      player.mute();
    } else {
      player.unMute();
    }

    this.testimonials[this.currentIndex].muted = this.userMuted;

    /*
     * Play the centered testimonial.
     */
    player.playVideo();
  }

  pauseAll(): void {
    this.players.forEach((player, index) => {
      if (player) {
        player.pauseVideo();
      }

      this.testimonials[index].playing = false;
    });
  }

  /*
   * ----------------------------------------
   * NAVIGATION
   * ----------------------------------------
   */

  next(): void {
    if (this.changing) {
      return;
    }

    if (this.currentIndex >= this.testimonials.length - 1) {
      return;
    }

    this.changing = true;

    this.pauseAll();

    this.currentIndex++;

    setTimeout(() => {
      this.changing = false;

      if (this.deckVisible) {
        this.playCenter();
      }
      /*
       * Don't automatically play
       * after navigation.
       *
       * User presses play.
       */
    }, 500);
  }

  prev(): void {
    if (this.changing) {
      return;
    }

    if (this.currentIndex <= 0) {
      return;
    }

    this.changing = true;

    this.pauseAll();

    this.currentIndex--;

    setTimeout(() => {
      this.changing = false;
      if (this.deckVisible) {
        this.playCenter();
      }
    }, 500);
  }

  /*
   * ----------------------------------------
   * CONTROLS
   * ----------------------------------------
   */

  togglePlay(index: number): void {
    if (index !== this.currentIndex) {
      return;
    }

    const player = this.players[index];

    if (!player) {
      return;
    }

    const state = player.getPlayerState();

    if (state === window.YT.PlayerState.PLAYING) {
      player.pauseVideo();
      this.testimonials[index].playing = false;
    } else {
      if (this.userMuted) {
        player.mute();
      } else {
        player.unMute();
      }

      player.playVideo();
    }
  }

  toggleMute(index: number): void {
    const player = this.players[index];

    if (!player) {
      return;
    }

    this.userMuted = !this.userMuted;

    /*
     * Apply globally so the
     * preference survives navigation.
     */
    this.players.forEach((p) => {
      if (!p) {
        return;
      }

      if (this.userMuted) {
        p.mute();
      } else {
        p.unMute();
      }
    });

    this.testimonials.forEach((t) => {
      t.muted = this.userMuted;
    });
  }

  /*
   * ----------------------------------------
   * PROGRESS
   * ----------------------------------------
   */

  private startProgressTracking(index: number): void {
    const update = () => {
      const player = this.players[index];

      if (!player) {
        return;
      }

      const duration = player.getDuration?.();

      const current = player.getCurrentTime?.();

      if (duration && duration > 0) {
        this.testimonials[index].progress = (current / duration) * 100;
      }
    };

    this.progressTimers[index] = setInterval(update, 100);
  }

  seek(e: MouseEvent | TouchEvent, i: number): void {
    const player = this.players[i];

    if (!player) {
      return;
    }

    const bar = e.currentTarget as HTMLElement;

    if (!bar) {
      return;
    }

    const rect = bar.getBoundingClientRect();

    let clientX = 0;

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
    }

    if (e instanceof TouchEvent && e.touches[0]) {
      clientX = e.touches[0].clientX;
    }

    if (!clientX) {
      return;
    }

    let percent = (clientX - rect.left) / rect.width;

    percent = Math.max(0, Math.min(1, percent));

    const duration = player.getDuration?.();

    if (!duration) {
      return;
    }

    player.seekTo(percent * duration, true);
  }

  /*
   * ----------------------------------------
   * SEEK DRAG
   * ----------------------------------------
   */

  isSeeking = false;

  private wasPlayingBeforeSeek = false;

  startSeek(e: MouseEvent | TouchEvent, i: number): void {
    e.preventDefault();
    e.stopPropagation();

    const player = this.players[i];

    if (!player) {
      return;
    }

    this.wasPlayingBeforeSeek =
      player.getPlayerState() === window.YT.PlayerState.PLAYING;

    player.pauseVideo();

    this.isSeeking = true;

    this.seek(e, i);

    const move = (ev: MouseEvent | TouchEvent) => {
      if (!this.isSeeking) {
        return;
      }

      this.seek(ev, i);
    };

    const stop = () => {
      this.isSeeking = false;

      if (this.wasPlayingBeforeSeek) {
        player.playVideo();
      }

      window.removeEventListener('mousemove', move);

      window.removeEventListener('mouseup', stop);

      window.removeEventListener('touchmove', move);

      window.removeEventListener('touchend', stop);
    };

    window.addEventListener('mousemove', move);

    window.addEventListener('mouseup', stop);

    window.addEventListener('touchmove', move, { passive: false });

    window.addEventListener('touchend', stop);
  }

  /*
   * ----------------------------------------
   * TOUCH / WHEEL
   * ----------------------------------------
   */

  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
  }

  onTouchEnd(e: TouchEvent): void {
    this.touchEndX = e.changedTouches[0].clientX;

    this.handleSwipe();
  }

  handleSwipe(): void {
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) < 50) {
      return;
    }

    if (diff > 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  onWheel(e: WheelEvent): void {
    if (!this.deckVisible) {
      return;
    }

    if (Math.abs(e.deltaX) < 20) {
      return;
    }

    if (e.deltaX > 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  /*
   * ----------------------------------------
   * KEYBOARD
   * ----------------------------------------
   */

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (!this.deckVisible) {
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();

      this.next();
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();

      this.prev();
    }

    if (e.code === 'Space') {
      e.preventDefault();

      this.togglePlay(this.currentIndex);
    }
  }

  /*
   * ----------------------------------------
   * CLEANUP
   * ----------------------------------------
   */

  ngOnDestroy(): void {
    this.deckObserver?.disconnect();

    this.progressTimers.forEach((timer) => clearInterval(timer));

    this.players.forEach((player) => {
      try {
        player?.destroy();
      } catch {
        // cleanup
      }
    });

    this.players = [];
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (document.hidden) {
      this.pauseAll();
    } else if (this.deckVisible) {
      this.playCenter();
    }
  }
}
