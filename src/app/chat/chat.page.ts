/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, Navigation, ActivatedRoute } from '@angular/router';
import { IonContent, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Thread, Message } from '../inbox/inbox.page';
import { ImageService } from '../providers/image.service';
import { filter, take } from 'rxjs/operators';
import { MessageService } from '../providers/message.service';
import { ImageViewPage } from './image-view/image-view.page'
import { GalleryViewPage } from './gallery-view/gallery-view.page'

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss']
})
export class ChatPage implements OnInit, OnDestroy {
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
  verifiedUser: boolean;
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
            // Existing conversation.
            this.currentSMS = this.inbox.find(o => o.idInmateSMS === this.inMessage.idIdentifier);
            await this.loadSMSThread()
          } else {
            // New conversation (Inmate initiated).
            this.currentSMSThread = new Array<Message>();
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
    this.outOfMessages = false;
    const amount = 20;

	  try {
      if (this.currentSMS) {	
        this.currentNumber = this.currentSMS.PhoneNumber;
      }

      this.verifiedUser = await this.checkForVerifiedUser(this.currentNumber);

      const messages = await this.messageService.getMessages(0, amount, this.currentNumber);
      
      this.currentSMSThread = this.messageService.concatSMSByID(this.currentSMSThread, messages, 'idInmateSMS', 'ASC');

		  if (this.currentSMS.FirstName.length === 0) {
			  this.currentContact = this.formatPhoneNumber(this.currentSMS.PhoneNumber);
		  } else {
			  this.currentContact = `${this.currentSMS.FirstName} ${this.currentSMS.LastName}`;
		  };
	  } catch (err) {
		  console.log(err);
	  } finally {
		  this.loading = false;
      requestAnimationFrame(() => this.content.scrollToBottom(100));
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
    let newMessages = [];

    try {
      newMessages = await this.messageService.getMessages(this.currentSMSThread.length, amount, this.currentNumber);

      this.currentSMSThread = this.messageService.concatSMSByID(this.currentSMSThread, newMessages, 'idInmateSMS', 'ASC');

      await this.wait(1000);
      this.currentSMSThread.push(...newMessages);
      this.outOfMessages = newMessages.length < amount;

      await this.messageService.waitRendering();

      const toPosition = scroll.scrollHeight - prevPos;
      await this.content.scrollByPoint(0, toPosition, 0);
      this.scroller.complete();
    } catch (err) {
      console.log(err)
    } finally {
      this.outOfMessages = newMessages.length < amount;
    }
  }

  async openModal(img) {
    const modal = await this.modalController.create({
      component: ImageViewPage,
      cssClass: 'image-modal',
      componentProps: {
        img
      }
    });

    modal.present();
  }

  async openGalleryModal() {
    const contact = this.currentContact;
    const number = this.currentNumber;

    const modal = await this.modalController.create({
      component: GalleryViewPage,
      cssClass: 'drawer-modal',
      componentProps: {
        contact,
        number
      }
    });

    await modal.present();
  }

  async checkForVerifiedUser(number: string) {
    // This is more complex in the real application.
    // For now we will just use the mock data, if they have a name they are verified.
    const userFound = this.currentSMSThread.some(o => o.FirstName.length > 0);

    return userFound;
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
