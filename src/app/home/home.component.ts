import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, Subscription, interval } from 'rxjs';
import { PhotosService } from '../photos.service';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSliderModule,
    MatProgressSpinnerModule,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  photos: any[] = [];
  selectedPhotoId: number | null = null;
  totalClicks: number = 0;
  photoClicks: { [key: number]: number } = {};
  showOverlay = false;
  private intervalSubscription: Subscription | null = null;

  constructor(private photoService: PhotosService) {}

  ngOnInit(): void {
    this.fetchPhotos();
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }

  fetchPhotos(): void {
    this.photoService.getPhotos().subscribe((photos) => {
      this.photos = photos;
      this.resetClickTracking();
      this.setupAutoChange();
    });
  }

  setupAutoChange(): void {
    this.loadNextSet();
  }

  clearInterval(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
      this.intervalSubscription = null;
    }
  }

  selectPhoto(photoId: number): void {
    this.selectedPhotoId = photoId;
    this.showOverlay = true;

    this.totalClicks++;
    if (this.photoClicks[photoId]) {
      this.photoClicks[photoId]++;
    } else {
      this.photoClicks[photoId] = 1;
    }

    setTimeout(() => {
      this.selectedPhotoId = null;
      this.showOverlay = false;

      this.loadNextSet();
    }, 3000);
  }

  getClickPercentage(photoId: number): number {
    return 50;
    return this.totalClicks > 0
      ? (this.photoClicks[photoId] / this.totalClicks) * 100
      : 0;
  }

  resetClickTracking(): void {
    this.selectedPhotoId = null;
    this.totalClicks = 0;
    this.photoClicks = {};
  }

  loadNextSet(): void {
    this.photoService.loadNextSet().subscribe((photos) => {
      this.photos = photos;
      this.resetClickTracking();
    });
  }
}
