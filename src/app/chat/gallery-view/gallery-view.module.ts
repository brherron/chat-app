import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GalleryViewPageRoutingModule } from './gallery-view-routing.module';
import { ChatImageModule } from '../chat-image/chat-image.module';
import { PipesModule } from '../../pipes/pipes.module'

import { GalleryViewPage } from './gallery-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GalleryViewPageRoutingModule,
    ChatImageModule,
    PipesModule
  ],
  declarations: [GalleryViewPage]
})
export class GalleryViewPageModule {}
