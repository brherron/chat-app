import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ChatImageComponent } from './chat-image.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		SharedModule
	],
	declarations: [
		ChatImageComponent,
	],
	exports: [
		ChatImageComponent
	]
})
export class ChatImageModule {}
