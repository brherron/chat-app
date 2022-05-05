/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Message } from '../inbox/inbox.page';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  data = fauxData;

  constructor() { }

  async getMessages(skip, limit, contact?): Promise<Message[]> {

    if (contact) {
      this.data = fauxData.filter(o => o.PhoneNumber === contact);
    }

    this.data.sort((a, b) => {
      if (a.CreationDate > b.CreationDate) {
        return -1;
      }

      if (a.CreationDate < b.CreationDate) {
        return 1;
      }

      return 0;
    });

    const messages = [];
    let current = 0;
    let counter = 0;

    for (const message of this.data) {
      if (current >= skip) {
        if (counter === limit) {
          break;
        }

        messages.push(message as Message);
        counter++;
      }

      current++;
    }

    console.log(messages)
    return messages;
  }

  async GetImageHistoryByContact(contact: string, skip: number, limit: number): Promise<Message[]> {
    let iMessages = fauxData
      .filter(o => o.PhoneNumber === contact)
      .filter(m => {
        if (m.SMSPictureURLs && m.SMSPictureURLs.length > 0) {
          return true;
        }
        return false;
      });

    const messages = [];
    let current = 0;
    let counter = 0;

    for (const message of iMessages) {
      if (current >= skip) {
        if (counter === limit) {
          break;
        }

        messages.push(message as Message);
        counter++;
      }

      current++;
    }

    console.log(messages)

    return messages;
  }

  public waitRendering(): Promise<void> {
		return Promise.race([
			new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
			new Promise<void>((resolve) => setTimeout(() => resolve())),
		]);
	}

  public concatSMSByID(arrayOld: Message[], arrayNew: Message[], key: string, order: string = 'DESC'): Message[] {
		if (!arrayNew.length && !arrayOld.length) {
			return [];
		}

		const first = arrayNew[0][key] as number;
		const last = arrayNew[arrayNew.length - 1][key] as number;

		arrayOld = arrayOld || [];
		arrayNew = arrayNew || [];
		arrayOld = arrayOld.filter(v => {
			return (
				(first > last && ((v[key] as number) >= first || (v[key] as number) <= last)) ||
				(first < last && ((v[key] as number) <= first || (v[key] as number) >= last)) ||
				(first as number) === (last as number)
			);
		});

		const oldData = arrayOld.filter(v => {
			let flag = true;
			arrayNew.forEach(m => {
				if (m[key] === v[key]) {
					flag = false;
				}
			});
			return flag;
		});

		let data = arrayNew.concat(oldData);

		let ord = -1;
		if (order === 'ASC') {
			ord = 1;
		}

		data = data.sort((a, b) => {
			const x = a[key] as number;
			const y = b[key] as number;
			if (x > y) {
				return ord;
			}
			if (x < y) {
				return ord * -1;
			}
			return 0;
		});

		return data;
	}
}

const fauxData = [
  {
    idInmateSMS: 123,
    CreationDate: new Date('2021-12-01T12:12:12.123Z'),
    IsIncoming: true,
    Message: 'Hey',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 124,
    CreationDate: new Date('2021-12-01T12:14:12.123Z'),
    IsIncoming: false,
    Message: 'Hey whats up',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 125,
    CreationDate: new Date('2021-12-01T12:14:15.123Z'),
    IsIncoming: false,
    Message: '',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: ['https://picsum.photos/240/300'],
  },
  {
    idInmateSMS: 126,
    CreationDate: new Date('2021-12-01T12:20:13.123Z'),
    IsIncoming: true,
    Message:
      'Yea this is awesome what are you up to today lol probalby not much ur in jail dude.',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 127,
    CreationDate: new Date('2021-12-01T12:29:13.123Z'),
    IsIncoming: true,
    Message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 128,
    CreationDate: new Date('2021-12-01T12:31:13.123Z'),
    IsIncoming: false,
    Message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 129,
    CreationDate: new Date('2021-12-01T12:33:13.123Z'),
    IsIncoming: true,
    Message: 'HEY',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 130,
    CreationDate: new Date('2021-12-01T12:34:13.123Z'),
    IsIncoming: true,
    Message: 'Hey d',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    Message: 'Hey',
    CreationDate: new Date('2021-11-23T20:55:54.000Z'),
    PhoneNumber: '1234567890',
    IsIncoming: false,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880800,
  },
  {
    Message: 'HELLO?',
    CreationDate: new Date('2021-11-23T21:55:54.000Z'),
    PhoneNumber: '1234567890',
    IsIncoming: false,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880800,
  },
  {
    Message: 'Hey sorry I was busy...',
    CreationDate: new Date('2021-11-23T21:59:54.000Z'),
    PhoneNumber: '1234567890',
    IsIncoming: true,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: ['https://picsum.photos/200/300'],
    idInmateSMS: 11880800,
  },
  {
    Message: 'All good. Hey sign up for an account.',
    CreationDate: new Date('2021-11-23T22:05:54.000Z'),
    PhoneNumber: '1234567890',
    IsIncoming: false,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880800,
  },
  {
    Message: 'Okay done.',
    CreationDate: new Date('2021-11-23T22:15:54.000Z'),
    PhoneNumber: '1234567890',
    IsIncoming: true,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880800,
  },
  {
    Message: 'Hey',
    CreationDate: new Date('2021-11-24T14:45:54.000Z'),
    PhoneNumber: '1234567890',
    IsIncoming: false,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880800,
  },
  {
    Message: 'Hey',
    CreationDate: new Date('2021-11-24T14:46:54.000Z'),
    PhoneNumber: '1234567890',
    IsIncoming: false,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880800,
  },
  {
    Message: 'Hey',
    CreationDate: new Date('2021-11-24T14:51:55.000Z'),
    PhoneNumber: '1234567890',
    IsIncoming: true,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: ['https://picsum.photos/200/300', 'https://picsum.photos/500/300'],
    idInmateSMS: 11880800,
  },
  {
    Message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    CreationDate: new Date('2021-11-24T14:52:54.000Z'),
    PhoneNumber: '1234567890',
    IsIncoming: false,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: ['https://picsum.photos/400/300', 'https://picsum.photos/400/200', 'https://picsum.photos/400/500'],
    idInmateSMS: 11880800,
  },
  {
    Message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    CreationDate: new Date('2021-11-24T14:53:54.000Z'),
    PhoneNumber: '1234567890',
    IsIncoming: true,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880800,
  },
  {
    Message:
      'Whats good?',
    CreationDate: new Date('2021-11-24T14:59:54.000Z'),
    PhoneNumber: '1234567890',
    IsIncoming: true,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880800,
  },
  {
    idInmateSMS: 131,
    CreationDate: new Date('2021-11-01T12:12:12.123Z'),
    IsIncoming: true,
    Message: 'Hey',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 132,
    CreationDate: new Date('2021-11-01T12:14:12.123Z'),
    IsIncoming: false,
    Message: 'Hey whats up',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 133,
    CreationDate: new Date('2021-11-01T12:14:15.123Z'),
    IsIncoming: true,
    Message: 'This texting app is neat',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 134,
    CreationDate: new Date('2021-11-01T12:20:13.123Z'),
    IsIncoming: false,
    Message:
      'Yea this is awesome what are you up to today lol probalby not much ur in jail dude.',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 135,
    CreationDate: new Date('2021-12-04T12:29:13.123Z'),
    IsIncoming: false,
    Message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 136,
    CreationDate: new Date('2021-11-01T12:31:13.123Z'),
    IsIncoming: true,
    Message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 137,
    CreationDate: new Date('2021-11-01T12:33:13.123Z'),
    IsIncoming: true,
    Message: 'Timmy',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: ['https://picsum.photos/900/1200'],
  },
  {
    idInmateSMS: 138,
    CreationDate: new Date('2021-11-01T12:34:13.123Z'),
    IsIncoming: true,
    Message: 'Blah blahbajlbkj',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 139,
    CreationDate: new Date('2021-11-04T12:29:13.123Z'),
    IsIncoming: false,
    Message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 140,
    CreationDate: new Date('2021-12-01T12:31:13.123Z'),
    IsIncoming: true,
    Message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 141,
    CreationDate: new Date('2021-12-01T12:33:13.123Z'),
    IsIncoming: true,
    Message: 'Timmy',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: ['https://picsum.photos/900/500', 'https://picsum.photos/200/300'],
  },
  {
    idInmateSMS: 142,
    CreationDate: new Date('2021-12-01T12:34:13.123Z'),
    IsIncoming: true,
    Message:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 143,
    CreationDate: new Date('2021-11-01T12:14:15.123Z'),
    IsIncoming: true,
    Message: 'This texting app is neat',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 144,
    CreationDate: new Date('2021-11-01T12:20:13.123Z'),
    IsIncoming: false,
    Message:
      'Yea this is awesome what are you up to today lol probalby not much ur in jail dude.',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 145,
    CreationDate: new Date('2021-12-04T12:29:13.123Z'),
    IsIncoming: false,
    Message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 146,
    CreationDate: new Date('2021-12-11T12:31:13.123Z'),
    IsIncoming: true,
    Message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 147,
    CreationDate: new Date('2021-12-11T12:33:13.123Z'),
    IsIncoming: true,
    Message: 'Timmy',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: ['https://picsum.photos/900/1200'],
  },
  {
    idInmateSMS: 148,
    CreationDate: new Date('2021-12-11T12:34:13.123Z'),
    IsIncoming: true,
    Message: 'Blah blahbajlbkj',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 149,
    CreationDate: new Date('2021-12-14T12:29:13.123Z'),
    IsIncoming: false,
    Message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 150,
    CreationDate: new Date('2021-12-23T12:31:13.123Z'),
    IsIncoming: true,
    Message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 151,
    CreationDate: new Date('2021-12-23T12:33:13.123Z'),
    IsIncoming: true,
    Message: 'Timmy',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: ['https://picsum.photos/400/500',],
  },
  {
    idInmateSMS: 152,
    CreationDate: new Date('2021-12-23T12:34:13.123Z'),
    IsIncoming: true,
    Message:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    FirstName: 'Beau',
    LastName: 'Herron',
    PhoneNumber: '7156104177',
    SMSPictureURLs: null,
  },
];