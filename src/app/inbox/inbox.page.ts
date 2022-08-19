/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { MessageService } from "../providers/message.service";
import { PhonePipe } from "../pipes/phone-number";
import * as JsSIP from "jssip";

@Component({
  selector: "app-inbox",
  templateUrl: "inbox.page.html",
  styleUrls: ["inbox.page.scss"],
})
export class InboxPage implements OnInit {
  page = 0;
  skip = 0;
  limit = 10;
  loading = false;
  inbox = [];
  threads = [];
  ua: any;

  constructor(
    private router: Router,
    private message: MessageService,
    private phonePipe: PhonePipe
  ) {}

  async ngOnInit() {
    this.loadMessages();
  }

  async loadMessages() {
    try {
      this.loading = true;

      this.inbox = await this.message.getMessages(0, 100);

      await this.addMessages();

      setTimeout(() => {
        this.loading = false;
      }, 1500);
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

    this.router.navigate(["chat"], navigationExtras);
  }

  async newMessage() {
    const navigationExtras: NavigationExtras = {
      state: {
        inbox: this.inbox,
      },
    };

    this.router.navigate(["chat"], navigationExtras);
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

        switch (t.FirstName) {
          case "Pigeon":
            g.AvatarURL = "../../assets/pigeonman.webp";
            break;
          case "Twister":
            g.AvatarURL = "../../assets/twister.png";
            break;
          case "Chip":
            g.AvatarURL = "../../assets/chipskylark.jpeg";
            break;
          default:
            g.AvatarURL = "../../assets/default.png";
            break;
        }

        g.Message =
          t.Message.substring(0, 50) + `${t.Message.length > 50 ? "..." : ""}`;
        if (t.FirstName.length > 0 && t.LastName.length > 0) {
          g.Subject = `${t.FirstName} ${t.LastName}`;
        } else {
          g.Subject = this.phonePipe.transform(t.PhoneNumber, "US");
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
  ShowTimestamp: boolean;
}

export class Thread {
  idIdentifier: number;
  CreationDate: Date;
  FirstName: string;
  LastName: string;
  Subject: string;
  Message: string;
  AvatarURL: string;
}
