/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, Navigation, ActivatedRoute } from '@angular/router';
import { IonContent, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Thread, Message } from '../tab1/tab1.page';
import { ImageService } from '../providers/image.service';
import { filter, take } from 'rxjs/operators';
import { MessageService } from '../providers/message.service';
import { ImageModalPage } from '../shared/image-modal/image-modal.page';
import { GalleryModalPage } from './gallery-modal/gallery-modal.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonInfiniteScroll) scroller: IonInfiniteScroll;
  Math = Math;
  inbox: Message[];
  navigation: Navigation;
  inMessage: Thread;
  loading = false;
  currentSMS: Message;
  currentSMSThread: Message[];
  currentContact = '';
  currentNumber = '';
  inputReply = '';
  activeInput = '';
  timestampThresh = 5;
  sub: any;
  imagesLoaded = false;
  outOfMessages = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imageService: ImageService,
    private messageService: MessageService,
    private modalController: ModalController
    ) {
      this.navigation = this.router.getCurrentNavigation();
      this.route.queryParams.subscribe(async (params) => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.inMessage = this.navigation.extras.state.message;
          this.inbox = this.navigation.extras.state.inbox;

          if (this.inMessage) {
            this.loadSMSThread();
          }
        }
      });

      this.sub = this.imageService.imagesLoading$.pipe(
        filter(r => r === 0)
      ).subscribe(_ => {
        if (!this.imagesLoaded) {
          this.imagesLoaded = true;

          setTimeout(() => {
            this.content.scrollToBottom(100);
          });
        };
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onChange(input: string) {
  	this.inputReply = input;
  }

  onInputChange(event: any) {
  }

  onFocus(inputName) {
    this.activeInput = inputName;
  }

  async onBlur() {
    if (this.currentNumber.length === 10) {
      const messages = this.inbox.filter(o => o.PhoneNumber === this.currentNumber);
      
      if (messages[0]) {
        this.currentSMS = messages[0];

        await this.loadSMSThread();
      }
    }
  }

  async loadSMSThread() {
	  this.loading = true;
    this.imagesLoaded = false;

	  try {
      if (!this.currentSMS) {		  
        this.currentSMS = this.inbox.find(o => o.idInmateSMS === this.inMessage.idIdentifier);
      }
      this.currentNumber = this.currentSMS.PhoneNumber;

		  if (this.currentSMS.FirstName.length === 0) {
			  this.currentContact = this.formatPhoneNumber(this.currentSMS.PhoneNumber);
		  } else {
			  this.currentContact = `${this.currentSMS.FirstName} ${this.currentSMS.LastName}`;
		  };

      this.currentSMSThread = await this.messageService.getMessages(0, 10, this.currentNumber);
	  } catch (err) {
		  this.loading = false;
		  console.log(err);
	  } finally {
		  this.loading = false;
		  setTimeout(() => {
			  this.content.scrollToBottom();
		  });
	  }
  }

  async replySMS() {
    this.loading = true;

    try {
      const copy = JSON.parse(JSON.stringify(this.currentSMS)) as Message;
      copy.Message = this.inputReply;
      copy.CreationDate = new Date();
      copy.IsIncoming = false;

      this.currentSMSThread.unshift(copy);
      this.inputReply = '';

      setTimeout(() => {
        this.content.scrollToBottom(200);
      }, 100);
    } catch (err) {
      this.loading = false;
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  async initiateSMS() {
    console.log(this.currentNumber);
  }

  async loadMoreMessages(amount) {
    const scroll = await this.content.getScrollElement();
    const prevPos = scroll.scrollHeight;
    let newPos = 0;

    try {
      const newMessages = await this.messageService.getMessages(this.currentSMSThread.length, amount, this.currentNumber);

      await this.wait(1000);
      this.currentSMSThread.push(...newMessages);
      this.outOfMessages = newMessages.length < amount;

      await this.imageService.imagesLoading$
        .pipe(
          filter(r => r === 0),
          take(1)
        )
        .toPromise()
        .then(_ => {
          newPos = scroll.scrollHeight - prevPos;
        });

      await Promise.race([
        new Promise((resolve) => requestAnimationFrame(resolve)),
        new Promise((resolve) => setTimeout(resolve))
      ]);

      const toPosition = scroll.scrollHeight - prevPos;

      await this.content.scrollByPoint(0, toPosition, 0);
      this.scroller.complete();
    } catch (err) {
      console.log(err)
    } finally {
    }
  }

  async openModal(img) {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      cssClass: 'transparent-modal',
      componentProps: {
        img
      }
    });

    modal.present();
  }

  async openGalleryModal() {
    const images = [];
    for (const message of this.currentSMSThread) {
      if (message.SMSPictureURLs && message.SMSPictureURLs.length > 0) {
        images.push(...message.SMSPictureURLs);
      }
    }

    const modal = await this.modalController.create({
      component: GalleryModalPage,
      cssClass: 'transparent-modal',
      componentProps: {
        images
      }
    });

    await modal.present();
  }

  wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  formatPhoneNumber(str: string) {
    const cleaned = ('' + str).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      const intlCode = (match[1] ? '+1 ' : '');
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    };
  }
}
