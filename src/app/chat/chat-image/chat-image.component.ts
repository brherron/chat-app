import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-image',
  templateUrl: './chat-image.component.html',
  styleUrls: ['./chat-image.component.scss'],
})
export class ChatImageComponent implements OnInit {
	@Input() src: string;
	@Input() maxHeight: number;
	@Input() maxWidth: number;
	@Input() borderRadius?: boolean = false;
	image = new Image();
	height = 150;
	width = 150;
	loading = true;

  constructor() { }

  ngOnInit() {
	  this.image.src = this.src;
  }

  setImageDimensions() {
	  let height = 0;
	  let width = 0;

	  if (this.image.height >= this.image.width) {
		  height = this.image.height > this.maxHeight ? this.maxHeight : this.image.height;
		  width = this.image.width * (height/this.image.height);
	  } else {
		  width = this.image.width > this.maxWidth ? this.maxWidth : this.image.width;
		  height = this.image.height * (width/this.image.width);
	  }

	  this.image.height = height;
	  this.image.width = width;
	  this.height = height;
	  this.width = width;

	  this.loading = false;
  }
}
