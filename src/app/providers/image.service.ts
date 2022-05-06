import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImageService {
  _imagesLoading = new Subject<number>();
  images: Map<HTMLElement, boolean> = new Map();
  imagesLoading = 0;

  imagesLoading$ = this._imagesLoading.asObservable();

  constructor() { }

  async imageLoading(img: HTMLElement) {
    if (!this.images.has(img) || this.images.get(img)) {
      this.images.set(img, false);
      this.imagesLoading++;
      this._imagesLoading.next(this.imagesLoading);
    }
  }

  imageLoadedOrError(img: HTMLElement) {
    if (this.images.has(img) && !this.images.get(img)) {
      this.images.set(img, true);
      this.imagesLoading--;
      this._imagesLoading.next(this.imagesLoading);
    }
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
