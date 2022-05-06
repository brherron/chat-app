import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[numbersOnly]'
})
export class NumberDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('keydown', ['$event']) onInputChange(evt) {

    if (evt.which === 8 || evt.which === 0) {
        return true;
    }

    const regex = new RegExp("^[0-9\~]*$");
    var key = String.fromCharCode(!evt.charCode ? evt.which : evt.charCode);

    if (!regex.test(key)) {
        evt.preventDefault();
        return false;
    }
    return true;
  }
}