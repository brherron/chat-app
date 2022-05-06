import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InboxPage } from './inbox.page';

import { InboxPageRoutingModule } from './inbox-routing.module';
import { PipesModule } from '../pipes/pipes.module'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    InboxPageRoutingModule,
    PipesModule
  ],
  declarations: [InboxPage]
})
export class InboxPageModule {}
