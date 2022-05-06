import { NgModule } from '@angular/core';

import { ImageDirective } from './image.directive';
import { NumberDirective } from './number.directive';

@NgModule({
	declarations: [
		ImageDirective,
    NumberDirective
	],
	exports: [
		ImageDirective,
    NumberDirective
	]
})
export class SharedModule {}
