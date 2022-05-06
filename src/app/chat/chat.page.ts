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
  // Init variables.
  @ViewChild(IonContent) content: IonContent;
  Math = Math;
  inbox: Message[];
  navigation: Navigation;
  inMessage: Thread;
  loading = false;
  outOfMessages = false;
  smsEnabled = true;
  
  // Message thread variables.
  currentSMS: Message;
  currentSMSThread: Message[];
  currentContact = '';
  currentNumber = '';
  verifiedUser: boolean;
  contactTyping = false;
  
  // Chat input variables
  inputReply = '';
  activeInput = '';
  timestampThresh = 10; // In minutes. Won't show message timestamp if previous message sent within this threshold.
  ratePerMessage = 0.05; // These values are for display only, actual rate logic is handled via backend.
  rateMultiplier = 2; // We start with double the rate until we can conclude the phone number is verified.
  numberOfMessages = 0;

  // RXJS variables
  sub: any;
  imagesLoaded = false;

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
            // New conversation.
            this.currentSMSThread = new Array<Message>();
          }
        }
      });

      // Wait for images to load before revealing thread.
      this.sub = this.imageService.imagesLoading$.pipe(
        filter(r => r === 0)
      ).subscribe(_ => {
        if (!this.imagesLoaded) {
          this.imagesLoaded = true;

          setTimeout(() => {
            this.content.scrollToBottom(300);
          });
        }
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

  async loadSMSThread() {
	  this.loading = true;
    this.outOfMessages = false;
    const amount = 15;

	  try {
      if (this.currentSMS) {	
        this.currentNumber = this.currentSMS.PhoneNumber;
      }

      this.verifiedUser = await this.checkForVerifiedUser();

      const messages = await this.messageService.getMessages(0, amount, this.currentNumber);

      this.currentSMSThread = this.messageService.concatSMSByID(this.currentSMSThread, messages, 'idInmateSMS', 'ASC');
	  } catch (err) {
		  console.log(err);
	  } finally {
      this.outOfMessages = this.currentSMSThread.length < amount;
		  this.loading = false;
      requestAnimationFrame(() => this.content.scrollToBottom(100));
	  }
  }

  async replySMS(event) {
    if (event.type === 'keyup' && event.keyCode != 13) {
      return;
    }

    try {
      this.loading = true;

      const copy = JSON.parse(JSON.stringify(this.currentSMS)) as Message;
      copy.idInmateSMS = this.currentSMS.idInmateSMS + 1;
      copy.Message = this.inputReply;
      copy.CreationDate = new Date();
      copy.IsIncoming = false;

      this.currentSMSThread.push(copy);
      this.currentSMS = this.currentSMSThread[this.currentSMSThread.length -1];

      requestAnimationFrame(() => this.content.scrollToBottom(100));   
      this.inputReply = '';
    } catch (err) {
      this.loading = false;
      console.log(err);

      // Visually remove message upon failure.
      setTimeout(() => this.currentSMSThread.pop(), 1000);
    } finally {
      this.loading = false;  
      // Hacky.
      if (event.type === 'keyup' && event.keyCode == 13) {
        setTimeout(() => {
          requestAnimationFrame(() => this.content.scrollToBottom(100)); 
        }, 100);
      }
      await this.simulateResponse(); 
    }
  }

  async loadMoreMessages(event, amount) {
    const scroll = await this.content.getScrollElement();
    const prevPos = scroll.scrollHeight;
    let newMessages = [];

    try {
      newMessages = await this.messageService.getMessages(this.currentSMSThread.length, amount, this.currentNumber);
      
      // Simulate loading.
      await wait(1000);      
      
      this.currentSMSThread = this.messageService.concatSMSByID(this.currentSMSThread, newMessages, 'idInmateSMS', 'ASC');
      await this.messageService.waitRendering();

      const toPosition = scroll.scrollHeight - prevPos;
      await this.content.scrollByPoint(0, toPosition, 0);
      await event.target.complete();
    } catch (err) {
      console.log(err)
    } finally {
      this.outOfMessages = newMessages.length < amount;
    }
  }

  async openImageModal(src, date) {
    const modal = await this.modalController.create({
      component: ImageViewPage,
      cssClass: 'image-modal',
      componentProps: {
        src,
        date
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

  async checkForVerifiedUser() {
    // This is more complex in the real application.
    // For now we will just use the mock data, if they have a name they are verified.
    if (!this.currentSMS) {
      return false;
    }
    
    const userFound = this.currentSMS.FirstName.length > 0;

    if (userFound) {
      this.currentContact = `${this.currentSMS.FirstName} ${this.currentSMS.LastName}`;
      this.rateMultiplier = 1;
    }

    return userFound;
  }

  countChar() {
    // Used to calculate message cost.
    this.numberOfMessages = Math.ceil(this.inputReply.length/160)
  }

  // If user types in contact of an existing thread, show that thread.
  async onNumberBlur() {
    this.imagesLoaded = false;

    if (this.currentNumber.length === 10) {
      const messages = this.inbox.filter(o => o.PhoneNumber === this.currentNumber);
      
      if (messages[0]) {
        this.currentSMS = messages[0];

        await this.loadSMSThread();
      }
    }
  }

  async simulateResponse() {
    var chance = 0.50;
    var random = Math.random();
  
    if (chance > random) {
      await wait(1000);
      this.contactTyping = true;
      setTimeout(() => {
        requestAnimationFrame(() => this.content.scrollToBottom(100)); 
      }, 100) 

      const copy = new Message();
      copy.idInmateSMS = this.currentSMS.idInmateSMS + 1;
      copy.Message = this.messageService.generateLoremIpsum(15);
      copy.CreationDate = new Date();
      copy.IsIncoming = true;
      copy.FirstName = this.currentSMS.FirstName;
      copy.LastName = this.currentSMS.LastName;
      copy.PhoneNumber = this.currentSMS.PhoneNumber;

      await wait(3000);
  
      this.contactTyping = false;
      this.currentSMSThread.push(copy);
      setTimeout(() => {
        requestAnimationFrame(() => this.content.scrollToBottom(100)); 
      }, 100) 
    }
  }
}


// Extra functions for simulation purposes.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));