import { NgModule } from '@angular/core';
import { PhonePipe } from './phone-number';

@NgModule({
	declarations: [
		PhonePipe,
	],
	exports: [
		PhonePipe,
	]
})
export class PipesModule {}
