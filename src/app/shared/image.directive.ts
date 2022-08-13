import { Directive, ElementRef, HostListener } from '@angular/core';
import { ImageService } from '../providers/image.service';

@Directive({
  selector: 'img'
})
export class ImageDirective {

  constructor(
      private elementRef: ElementRef,
      private imageService: ImageService
  ) {
    imageService.imageLoading(elementRef.nativeElement);
  }

  @HostListener('load')
  onLoad() {
    this.imageService.imageLoadedOrError(this.elementRef.nativeElement);
  }

  @HostListener('error')
  onError() {
    this.imageService.imageLoadedOrError(this.elementRef.nativeElement);
  }
}
