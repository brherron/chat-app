import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ChatImageComponent } from './chat-image/chat-image.component';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { MyImgDirective } from '../providers/img.directive';
import { NumberDirective } from '../providers/numbersonly.directive';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule
  ],
  declarations: [
    Tab2Page,
    ChatImageComponent,
    MyImgDirective,
    NumberDirective
  ],
  exports: [NumberDirective]
})
export class Tab2PageModule {}
