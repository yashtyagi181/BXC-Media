import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

@Component({
  selector: 'app-video-phones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-phones.component.html',
})
export class VideoPhonesComponent implements AfterViewInit, OnDestroy {
  videos = [
    { id: 'oCKZqS90OtU' },
    { id: 'JyzPTlcNTI8' },
    { id: 'xc079K49fmQ' },
  ];

  isVisible: boolean[] = [];
  isHovered: boolean[] = [];
  isMuted: boolean[] = [];

  @ViewChildren('videoRef')
  videoRefs!: QueryList<ElementRef>;

  @ViewChildren('videoPlayer')
  videoPlayers!: QueryList<ElementRef<HTMLDivElement>>;

  private observer!: IntersectionObserver;

  private players: any[] = [];

  private pageVisible = true;

  private youtubeApiPromise?: Promise<void>;

  private destroyed = false;

  ngAfterViewInit(): void {
    const count = this.videos.length;

    this.isVisible = new Array(count).fill(false);
    this.isHovered = new Array(count).fill(false);
    this.isMuted = new Array(count).fill(true);

    /*
     * Load YouTube API and create players.
     */
    this.loadYouTubeAPI().then(() => {
      if (this.destroyed) {
        return;
      }

      this.createPlayers();
    });

    /*
     * Observe phone visibility.
     */
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = this.videoRefs
            .toArray()
            .findIndex((el) => el.nativeElement === entry.target);

          if (index === -1) {
            return;
          }

          if (entry.isIntersecting) {
            this.isVisible[index] = true;

            /*
             * Do NOT autoplay just because
             * the phone became visible.
             *
             * Hover is still required.
             */
            if (this.pageVisible && this.isHovered[index]) {
              this.playVideo(index);
            }
          } else {
            this.isVisible[index] = false;

            /*
             * Pause if phone leaves viewport.
             */
            this.pauseVideo(index);
          }
        });
      },
      {
        threshold: 0.35,
      },
    );

    this.videoRefs.forEach((el) => {
      this.observer.observe(el.nativeElement);
    });

    /*
     * Browser tab visibility.
     */
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  /*
   * Load YouTube IFrame Player API only once.
   */
  private loadYouTubeAPI(): Promise<void> {
    if (window.YT?.Player) {
      return Promise.resolve();
    }

    if (this.youtubeApiPromise) {
      return this.youtubeApiPromise;
    }

    this.youtubeApiPromise = new Promise<void>((resolve) => {
      const existingScript = document.getElementById('youtube-iframe-api');

      if (existingScript) {
        const checkAPI = () => {
          if (window.YT?.Player) {
            resolve();
          } else {
            setTimeout(checkAPI, 50);
          }
        };

        checkAPI();
        return;
      }

      const previousCallback = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        resolve();
      };

      const script = document.createElement('script');

      script.id = 'youtube-iframe-api';

      script.src = 'https://www.youtube.com/iframe_api';

      document.head.appendChild(script);
    });

    return this.youtubeApiPromise;
  }

  /*
   * Create each YouTube player exactly once.
   */
  private createPlayers(): void {
    const containers = this.videoPlayers.toArray();

    containers.forEach((container, index) => {
      if (this.players[index]) {
        return;
      }

      const player = new window.YT.Player(container.nativeElement, {
        videoId: this.videos[index].id,

        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          loop: 1,
          playlist: this.videos[index].id,
        },

        events: {
          onReady: () => {
            /*
             * Always start muted.
             */
            player.mute();

            /*
             * Do NOT autoplay here.
             */
            if (
              this.pageVisible &&
              this.isVisible[index] &&
              this.isHovered[index]
            ) {
              this.playVideo(index);
            }
          },

          onStateChange: (event: any) => {
            /*
             * YT.PlayerState.ENDED = 0
             *
             * Restart immediately instead
             * of relying on playlist looping.
             */
            if (event.data === window.YT.PlayerState.ENDED) {
              if (
                this.pageVisible &&
                this.isVisible[index] &&
                this.isHovered[index]
              ) {
                player.seekTo(0, true);

                player.playVideo();
              } else {
                player.seekTo(0, true);

                player.pauseVideo();
              }
            }
          },
        },
      });

      this.players[index] = player;
    });
  }

  /*
   * Mouse entered phone.
   */
  onMouseEnter(index: number): void {
    this.isHovered[index] = true;

    if (this.pageVisible && this.isVisible[index]) {
      this.playVideo(index);
    }
  }

  /*
   * Mouse left phone.
   */
  onMouseLeave(index: number): void {
    this.isHovered[index] = false;

    this.pauseVideo(index);
  }

  /*
   * Play one video.
   */
  playVideo(index: number): void {
    if (!this.pageVisible || !this.isVisible[index] || !this.isHovered[index]) {
      return;
    }

    const player = this.players[index];

    if (!player) {
      return;
    }

    /*
     * Pause every other video.
     */
    this.players.forEach((otherPlayer, otherIndex) => {
      if (otherPlayer && otherIndex !== index) {
        otherPlayer.pauseVideo();
      }
    });

    /*
     * IMPORTANT:
     *
     * Reapply actual YouTube mute state
     * before every play.
     *
     * This keeps the UI state and YouTube
     * state synchronized.
     */
    if (this.isMuted[index]) {
      player.mute();
    } else {
      player.unMute();
    }

    player.playVideo();
  }

  /*
   * Pause video.
   */
  pauseVideo(index: number): void {
    const player = this.players[index];

    if (!player) {
      return;
    }

    player.pauseVideo();
  }

  /*
   * Toggle mute.
   */
  toggleMute(index: number): void {
    const player = this.players[index];

    if (!player) {
      return;
    }

    this.isMuted[index] = !this.isMuted[index];

    if (this.isMuted[index]) {
      player.mute();
    } else {
      player.unMute();
    }
  }

  /*
   * Browser tab visibility.
   */
  private handleVisibilityChange = (): void => {
    this.pageVisible = !document.hidden;

    /*
     * Tab hidden:
     * pause EVERYTHING.
     */
    if (!this.pageVisible) {
      this.players.forEach((player) => {
        if (player) {
          player.pauseVideo();
        }
      });

      return;
    }

    /*
     * Tab visible again:
     *
     * Only the currently hovered,
     * visible phone is allowed to play.
     */
    this.players.forEach((_, index) => {
      if (this.isVisible[index] && this.isHovered[index]) {
        this.playVideo(index);
      } else {
        this.pauseVideo(index);
      }
    });
  };

  ngOnDestroy(): void {
    this.destroyed = true;

    if (this.observer) {
      this.observer.disconnect();
    }

    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
    );

    /*
     * Destroy YouTube players.
     */
    this.players.forEach((player) => {
      try {
        player?.destroy();
      } catch {
        // Ignore cleanup errors.
      }
    });

    this.players = [];
  }
}
