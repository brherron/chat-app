import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GalleryModalPageRoutingModule } from './gallery-modal-routing.module';

import { GalleryModalPage } from './gallery-modal.page';
import { ChatImageComponent } from '../chat-image/chat-image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GalleryModalPageRoutingModule
  ],
  declarations: [GalleryModalPage, ChatImageComponent]
})
export class GalleryModalPageModule {}
