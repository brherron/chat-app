/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { MessageService } from '../providers/message.service';
import * as JsSIP from 'jssip';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  page = 0;
  skip = 0;
  limit = 10;
  loading = false;
  inbox = [];
  threads = [];
  ua: any;

  constructor(private router: Router,
    private message: MessageService) {
    this.loadMessages();
  }

  async ngOnInit() {
    const socket = new JsSIP.WebSocketInterface('ws://asteriskdev.inmatecanteen.com:8088/ws');
    const configuration = {
      sockets  : [ socket ],
      uri      : 'sip:OFFICE201@asteriskdev.inmatecanteen.com',
      password : 'cAQaVa8jVT',
      register : true,
    };


    this.ua = new JsSIP.UA(configuration);

    console.log(this.ua);
    this.ua.on('registered', (e) => {
      console.log(e);
    });
  }

  async loadMessages() {
    try {
      this.loading = true;

      this.inbox = await this.message.getMessages(0, 100);

      await this.addMessages();

      this.loading = false;
    } catch (err) {
      this.loading = false;
      console.log(err);
    }
  }

  async selectMessage(thread: Thread) {
    const navigationExtras: NavigationExtras = {
      state: {
        message: thread,
        inbox: this.inbox,
      },
    };

    this.router.navigate(['tab2'], navigationExtras);
  }

  async newMessage() {
    const navigationExtras: NavigationExtras = {
      state: {
        message: null,
        inbox: this.inbox,
      },
    };

    this.router.navigate(['tab2'], navigationExtras);
  }

  async addMessages() {
    const gInbox = [];

    if (this.inbox.length > 0) {
      const smsThreads = await this.simulateThreads(this.inbox);

      for (const thread of smsThreads) {
        // Most recent message for display.
        const t = thread.Messages[0];

        const g = new Thread();
        g.CreationDate = t.CreationDate;
        g.idIdentifier = t.idInmateSMS;
        g.Message =
          t.Message.substring(0, 50) + `${t.Message.length > 50 ? '...' : ''}`;
        if (t.FirstName.length > 0 && t.LastName.length > 0) {
          g.Subject = `${t.FirstName}  ${t.LastName}`;
        } else {
          g.Subject = `SMS from ${t.PhoneNumber}`;
        }

        gInbox.push(g);
      }
    }

    gInbox.sort((a, b) => {
      if (a.CreationDate > b.CreationDate) {
        return -1;
      }

      if (a.CreationDate < b.CreationDate) {
        return 1;
      }

      return 0;
    });

    this.threads = gInbox;
  }

  composeEmail() {
    console.log('Email');
  }

  composeSMS() {

  }

  async simulateThreads(messages) {
    const uniqueNumbers = messages
      .map((message) => message.PhoneNumber)
      .filter((val, index, self) => self.indexOf(val) === index);

    const smsThreads = [];
    for (const pNumber of uniqueNumbers) {
      const thread = new InmateSMSThread();
      thread.PhoneNumber = pNumber;
      thread.Messages = messages.filter((o) => o.PhoneNumber === pNumber);

      for (const message of thread.Messages) {
        message.CreationDate = new Date(message.CreationDate);
      }

      smsThreads.push(thread);
    }

    smsThreads.sort((a, b) => {
      if (a.Messages[0].CreationDate > b.Messages[0].CreationDate) {
        return -1;
      }

      if (a.Messages[0].CreationDate < b.Messages[0].CreationDate) {
        return 1;
      }

      return 0;
    });

    return smsThreads;
  }
}

export class InmateSMSThread {
  PhoneNumber: string;
  Messages: Message[];
}

export class Message {
  idInmateSMS: number;
  CreationDate: Date;
  IsIncoming: boolean;
  Message: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  SMSPictureURLs: string[];
}

export class Thread {
  idIdentifier: number;
  CreationDate: Date;
  FirstName: string;
  LastName: string;
  Subject: string;
  Message: string;
}
