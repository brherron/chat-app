/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, HostListener } from '@angular/core';
import { ImageService } from './image.service';


@Directive({
  selector: 'img'
})
export class MyImgDirective {

  constructor(private el: ElementRef,
              private imageService: ImageService) {

    imageService.imageLoading(el.nativeElement);
  }

  @HostListener('load')
  onLoad() {
    this.imageService.imageLoadedOrError(this.el.nativeElement);
  }

  @HostListener('error')
  onError() {
    this.imageService.imageLoadedOrError(this.el.nativeElement);
  }
}
