import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { ChatImageModule } from './chat-image/chat-image.module';
import { MyImgDirective } from '../providers/img.directive';
import { NumberDirective } from '../providers/numbersonly.directive';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ChatPageRoutingModule,
    ChatImageModule
  ],
  declarations: [
    ChatPage,
    MyImgDirective,
    NumberDirective
  ],
  exports: [NumberDirective]
})
export class ChatPageModule {}
