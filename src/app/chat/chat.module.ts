import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { ChatImageModule } from './chat-image/chat-image.module';

import { PipesModule } from '../pipes/pipes.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ChatPageRoutingModule,
    ChatImageModule,
    PipesModule,
    SharedModule
  ],
  declarations: [
    ChatPage,
  ]
})
export class ChatPageModule {}
