import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageViewPage } from '../image-view/image-view.page';

import { MessageService } from '../../providers/message.service';

@Component({
  selector: 'app-gallery-view',
  templateUrl: './gallery-view.page.html',
  styleUrls: ['./gallery-view.page.scss'],
})
export class GalleryViewPage implements OnInit {
  @Input('contact') contact: string;
  @Input('number') number: string;
  imageMessages = [];
  images = [];
  loading = false;
  outOfImages = false;

  constructor(
      private modalController: ModalController,
      private messageService: MessageService,
      ) { }

  async ngOnInit() {
    this.loading = true;
    const limit = 21;

    try {
      this.imageMessages = await this.messageService.GetImageHistoryByContact(this.number, 0, limit);

      if (this.imageMessages.length === 0) {
        return;
      } else if (this.imageMessages.length < limit) {
        this.outOfImages = true;
      }

      this.imageMessages.map((message) => {
        for (var i = message.SMSPictureURLs.length - 1; i >= 0; i--) {
          const image = {
            CreationDate: new Date(message.CreationDate),
            Src: message.SMSPictureURLs[i]
          }

          this.images.push(image);
        }
      });
    } catch (err) {
      console.log(err)
    } finally {
      this.loading = false;
    }
  }

  ionViewDidLeave() {
    this.close();
  }

  async loadMoreImages(event) {
    const limit = 9;

    try {
      const newImages = await this.messageService.GetImageHistoryByContact(this.number, this.images.length, limit);

      if (newImages.length < limit) {
        this.outOfImages = true;
      }
      
      newImages.map((message) => {
        for (const imageURL of message.SMSPictureURLs) {
          const image = {
            CreationDate: new Date(message.CreationDate),
            Src: imageURL
          }
      
          this.images.push(image);
        }
      });

      await event.target.complete();
    } catch (err) {
      console.log(err)
    }
  }

  async close() {
    await this.modalController.dismiss();
  }

  async openImageModal(src, date) {
    const modal = await this.modalController.create({
      component: ImageViewPage,
      cssClass: 'image-modal',
      componentProps: {
        src,
        date
      }
    });

    await modal.present();
  }
}
