import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ChatImageComponent } from './chat-image.component';
import { CommonModule } from '@angular/common';

@NgModule({
	imports: [
		CommonModule,
		IonicModule
	],
	declarations: [
		ChatImageComponent
	],
	exports: [
		ChatImageComponent
	]
})
export class ChatImageModule {}
