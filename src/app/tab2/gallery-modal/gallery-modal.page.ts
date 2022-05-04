import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from 'src/app/shared/image-modal/image-modal.page';

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.page.html',
  styleUrls: ['./gallery-modal.page.scss'],
})
export class GalleryModalPage implements OnInit {
  @Input('images') images: string[];
  leftImages = [];
  rightImages = [];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    if (this.images && this.images.length > 0) {
      for (let i = 0; i < this.images.length; i++) {
        if (i % 2 === 0) {
          this.rightImages.push(this.images[i]);
        } else {
          this.leftImages.push(this.images[i]);
        }
      }
    }

    console.log(this.leftImages, this.rightImages)
  }

  async openModal(img) {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      cssClass: 'transparent-modal',
      componentProps: {
        img
      }
    });

    modal.present();
  }
}
