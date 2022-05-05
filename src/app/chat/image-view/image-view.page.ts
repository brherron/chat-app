import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.page.html',
  styleUrls: ['./image-view.page.scss'],
})
export class ImageViewPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  @Input('src') src: any;
  @Input('date') date?: Date;
  sliderOpts = {
    zoom: true,
    allowTouchMove: false
  }

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  ionViewDidEnter() {
    this.slides.update;
  }

  async close() {
    await this.modalController.dismiss();
  }
}
