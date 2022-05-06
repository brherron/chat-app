/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Message } from '../inbox/inbox.page';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  data = fauxData
    .map(o => {
      let rand = Math.floor(Math.random() * 30)
      if (rand < 5) {
        rand = 5;
      }

      if (o.Message === ' ') {
        const message = this.generateLoremIpsum(rand);
        o.Message = message;
      }

      return o;
    });

  constructor() { 
  }

  async getMessages(skip, limit, contact?): Promise<Message[]> {
    let mData = this.data.sort((a, b) => {
      if (a.CreationDate > b.CreationDate) {
        return -1;
      }

      if (a.CreationDate < b.CreationDate) {
        return 1;
      }

      return 0;
    });
    
    if (contact) {
      mData = mData.filter(o => o.PhoneNumber === contact);
    }

    const messages = [];
    let current = 0;
    let counter = 0;

    for (const message of mData) {
      if (current >= skip) {
        if (counter === limit) {
          break;
        }

        messages.push(message as Message);
        counter++;
      }

      current++;
    }

    return messages;
  }

  async GetImageHistoryByContact(contact: string, skip: number, limit: number): Promise<Message[]> {
    let iMessages = this.data
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

    return messages;
  }

  public waitRendering(): Promise<void> {
		return Promise.race([
			new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
			new Promise<void>((resolve) => setTimeout(() => resolve())),
		]);
	}

  public generateLoremIpsum(num_words) {
    var words, ii, position, word, current, sentences, sentence_length, sentence;
    
    /**
     * @default 100
     */
    num_words = num_words || 100;
    
    words = [loremIpsum[0], loremIpsum[1]];
    num_words -= 2;
    
    for (ii = 0; ii < num_words; ii++) {
      position = Math.floor(Math.random() * loremIpsum.length);
      word = loremIpsum[position];
      
      if (ii > 0 && words[ii - 1] === word) {
        ii -= 1;
        
      } else {
        words[ii] = word;
      }
    }
    
    sentences = [];
    current = 0;
    
    while (num_words > 0) {
      sentence_length = getRandomSentenceLength();
      
      if (num_words - sentence_length < 4) {
        sentence_length = num_words;
      }
      
      num_words -= sentence_length;
      
      sentence = [];
      
      for (ii = current; ii < (current + sentence_length); ii++) {
        sentence.push(words[ii]);
      }
      
      sentence = punctuate(sentence);
      current += sentence_length;
      sentences.push(sentence.join(' '));
    }
    
    return sentences.join(' ');
  };

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
    CreationDate: new Date('2021-10-01T12:12:12.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 124,
    CreationDate: new Date('2021-10-01T12:14:12.123Z'),
    IsIncoming: false,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 125,
    CreationDate: new Date('2021-10-01T12:14:15.123Z'),
    IsIncoming: false,
    Message: '',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: ['https://picsum.photos/240/300'],
  },
  {
    idInmateSMS: 126,
    CreationDate: new Date('2021-10-01T12:20:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 127,
    CreationDate: new Date('2021-10-01T12:29:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 128,
    CreationDate: new Date('2021-10-01T12:31:13.123Z'),
    IsIncoming: false,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 129,
    CreationDate: new Date('2021-10-01T12:33:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 130,
    CreationDate: new Date('2021-10-01T12:34:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    Message: ' ',
    CreationDate: new Date('2021-11-23T20:55:54.000Z'),
    PhoneNumber: '5551234567',
    IsIncoming: false,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880800,
  },
  {
    Message: ' ',
    CreationDate: new Date('2021-11-23T21:55:54.000Z'),
    PhoneNumber: '5551234567',
    IsIncoming: false,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880801,
  },
  {
    Message: '',
    CreationDate: new Date('2021-11-23T21:59:54.000Z'),
    PhoneNumber: '5551234567',
    IsIncoming: true,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: ['https://picsum.photos/200/300'],
    idInmateSMS: 11880802,
  },
  {
    Message: ' ',
    CreationDate: new Date('2021-11-23T22:05:54.000Z'),
    PhoneNumber: '5551234567',
    IsIncoming: false,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880803,
  },
  {
    Message: ' ',
    CreationDate: new Date('2021-11-23T22:15:54.000Z'),
    PhoneNumber: '5551234567',
    IsIncoming: true,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880804,
  },
  {
    Message: ' ',
    CreationDate: new Date('2021-11-24T14:45:54.000Z'),
    PhoneNumber: '5551234567',
    IsIncoming: false,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880805,
  },
  {
    Message: ' ',
    CreationDate: new Date('2021-11-24T14:46:54.000Z'),
    PhoneNumber: '5551234567',
    IsIncoming: false,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880806,
  },
  {
    Message: '',
    CreationDate: new Date('2021-11-24T14:51:55.000Z'),
    PhoneNumber: '5551234567',
    IsIncoming: true,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: ['https://picsum.photos/290/330', 'https://picsum.photos/500/300'],
    idInmateSMS: 11880807,
  },
  {
    Message: '',
    CreationDate: new Date('2021-11-24T14:52:54.000Z'),
    PhoneNumber: '5551234567',
    IsIncoming: false,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: ['https://picsum.photos/400/300', 'https://picsum.photos/400/200', 'https://picsum.photos/400/500'],
    idInmateSMS: 11880808,
  },
  {
    Message: ' ',
    CreationDate: new Date('2021-11-24T14:53:54.000Z'),
    PhoneNumber: '5551234567',
    IsIncoming: true,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880809,
  },
  {
    Message: ' ',
    CreationDate: new Date('2021-11-24T14:59:54.000Z'),
    PhoneNumber: '5551234567',
    IsIncoming: true,
    FirstName: '',
    LastName: '',
    SMSPictureURLs: null,
    idInmateSMS: 11880810,
  },
  {
    idInmateSMS: 131,
    CreationDate: new Date('2021-11-01T12:12:12.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 132,
    CreationDate: new Date('2021-11-01T12:14:12.123Z'),
    IsIncoming: false,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 133,
    CreationDate: new Date('2021-11-01T12:14:15.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 134,
    CreationDate: new Date('2021-11-01T12:20:13.123Z'),
    IsIncoming: false,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 135,
    CreationDate: new Date('2021-11-01T12:29:13.123Z'),
    IsIncoming: false,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 136,
    CreationDate: new Date('2021-11-01T12:31:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 137,
    CreationDate: new Date('2021-11-01T12:33:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: ['https://picsum.photos/900/1200'],
  },
  {
    idInmateSMS: 138,
    CreationDate: new Date('2021-11-01T12:34:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 139,
    CreationDate: new Date('2021-11-04T12:29:13.123Z'),
    IsIncoming: false,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 140,
    CreationDate: new Date('2021-12-01T12:31:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 141,
    CreationDate: new Date('2021-12-01T12:33:13.123Z'),
    IsIncoming: true,
    Message: '',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: ['https://picsum.photos/900/500', 'https://picsum.photos/260/380'],
  },
  {
    idInmateSMS: 142,
    CreationDate: new Date('2021-12-01T12:34:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 143,
    CreationDate: new Date('2021-11-01T12:14:15.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 144,
    CreationDate: new Date('2021-11-01T12:20:13.123Z'),
    IsIncoming: false,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 145,
    CreationDate: new Date('2021-12-04T12:29:13.123Z'),
    IsIncoming: false,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 146,
    CreationDate: new Date('2021-12-11T12:31:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 147,
    CreationDate: new Date('2021-12-11T12:33:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: ['https://picsum.photos/900/1100'],
  },
  {
    idInmateSMS: 148,
    CreationDate: new Date('2021-12-11T12:34:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 149,
    CreationDate: new Date('2021-12-14T12:29:13.123Z'),
    IsIncoming: false,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 150,
    CreationDate: new Date('2021-12-23T12:31:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 151,
    CreationDate: new Date('2021-12-23T12:33:13.123Z'),
    IsIncoming: true,
    Message: '',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: ['https://picsum.photos/450/560',],
  },
  {
    idInmateSMS: 152,
    CreationDate: new Date('2021-12-23T12:34:13.123Z'),
    IsIncoming: true,
    Message: ' ',
    FirstName: 'Image',
    LastName: 'Testing',
    PhoneNumber: '5555555555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1000,
    CreationDate: new Date('2021-05-01T12:34:13.123Z'),
    IsIncoming: true,
    Message: "Tuesday's... applesauce day.",
    FirstName: 'Chip',
    LastName: 'Skylark',
    PhoneNumber: '5551235555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1001,
    CreationDate: new Date('2021-05-01T12:34:40.123Z'),
    IsIncoming: false,
    Message: "Sorry about all this, Chip.",
    FirstName: 'Chip',
    LastName: 'Skylark',
    PhoneNumber: '5551235555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1002,
    CreationDate: new Date('2021-05-01T12:35:13.123Z'),
    IsIncoming: true,
    Message: "That's all right, little pal. It's not like you wished for this to happen.",
    FirstName: 'Chip',
    LastName: 'Skylark',
    PhoneNumber: '5551235555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1003,
    CreationDate: new Date('2021-05-04T17:35:13.123Z'),
    IsIncoming: false,
    Message: "Feel better now?",
    FirstName: 'Chip',
    LastName: 'Skylark',
    PhoneNumber: '5551235555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1004,
    CreationDate: new Date('2021-05-04T17:37:13.123Z'),
    IsIncoming: true,
    Message: "Yeah. I didn't have to go to the bathroom, but the sound of flushing calms me down.",
    FirstName: 'Chip',
    LastName: 'Skylark',
    PhoneNumber: '5551235555',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 555,
    CreationDate: new Date('2022-03-01T12:30:13.123Z'),
    IsIncoming: false,
    Message: "",
    FirstName: 'Pigeon',
    LastName: 'Man',
    PhoneNumber: '5551234321',
    SMSPictureURLs: ['https://picsum.photos/900/500'],
  },
  {
    idInmateSMS: 1005,
    CreationDate: new Date('2022-03-04T17:37:13.123Z'),
    IsIncoming: false,
    Message: "...What?! This is awful! Who did this?",
    FirstName: 'Pigeon',
    LastName: 'Man',
    PhoneNumber: '5551234321',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1006,
    CreationDate: new Date('2022-03-04T17:39:13.123Z'),
    IsIncoming: true,
    Message: "...People...",
    FirstName: 'Pigeon',
    LastName: 'Man',
    PhoneNumber: '5551234321',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1007,
    CreationDate: new Date('2022-03-04T17:41:13.123Z'),
    IsIncoming: false,
    Message: "We can rebuild the cages, sweep up; your birds will come back.",
    FirstName: 'Pigeon',
    LastName: 'Man',
    PhoneNumber: '5551234321',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1008,
    CreationDate: new Date('2022-03-04T17:41:25.123Z'),
    IsIncoming: true,    
    Message: "Of course they'll come back: They're birds. I trust them. I understand them. It's people I don't understand...You see, Arnold, it's time for me to leave here. Some people are meant to be with people, and others, like me, are just different.",
    FirstName: 'Pigeon',
    LastName: 'Man',
    PhoneNumber: '5551234321',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1009,
    CreationDate: new Date('2022-03-04T17:45:13.123Z'),
    IsIncoming: false,
    Message: "Pigeon Man, wait. None of this would've happened if I hadn't—",
    FirstName: 'Pigeon',
    LastName: 'Man',
    PhoneNumber: '5551234321',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1010,
    CreationDate: new Date('2022-03-04T17:46:13.123Z'),
    IsIncoming: true,
    Message: "Arnold, don't be sad. You taught me that some people can be trusted... And I'll never forget that.",
    FirstName: 'Pigeon',
    LastName: 'Man',
    PhoneNumber: '5551234321',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1011,
    CreationDate: new Date('2022-03-04T17:47:13.123Z'),
    IsIncoming: false,
    Message: "Where will you go?",
    FirstName: 'Pigeon',
    LastName: 'Man',
    PhoneNumber: '5551234321',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1012,
    CreationDate: new Date('2022-03-04T17:49:13.123Z'),
    IsIncoming: true,
    Message: "Somewhere I can live in peace with my friends. Don't you see? I have a mission to help pigeons everywhere. Wherever there's a bird in need of seed; I'll be there. Wherever there's a helpless flock suffering some abuse; I'll be there. Wherever there's a pigeon with a weak wing or a broken beak; I'll be there.",
    FirstName: 'Pigeon',
    LastName: 'Man',
    PhoneNumber: '5551234321',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1013,
    CreationDate: new Date('2022-03-04T17:51:13.123Z'),
    IsIncoming: false,
    Message: "Vincent?",
    FirstName: 'Pigeon',
    LastName: 'Man',
    PhoneNumber: '5551234321',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1014,
    CreationDate: new Date('2022-03-04T17:52:13.123Z'),
    IsIncoming: true,
    Message: "I just hope there's another Arnold where I go next. (A flock of pigeons gather and take him away) Remember, Arnold, always wash your berries before you eat them...And fly towards the sun!",
    FirstName: 'Pigeon',
    LastName: 'Man',
    PhoneNumber: '5551234321',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1015,
    CreationDate: new Date('2022-03-04T17:55:13.123Z'),
    IsIncoming: false,
    Message: "Goodbye, Pigeon Man.",
    FirstName: 'Pigeon',
    LastName: 'Man',
    PhoneNumber: '5551234321',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1016,
    CreationDate: new Date('2022-05-01T14:25:13.123Z'),
    IsIncoming: true,
    Message: "I aced the test! ACED!! A-C-E-D. Me, Twister, T-W-I-S-T-E-R!",
    FirstName: 'Twister',
    LastName: 'Rodriguez',
    PhoneNumber: '5551239999',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1017,
    CreationDate: new Date('2022-05-01T14:33:13.123Z'),
    IsIncoming: false,
    Message: "Twister, enough.",
    FirstName: 'Twister',
    LastName: 'Rodriguez',
    PhoneNumber: '5551239999',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1018,
    CreationDate: new Date('2022-05-01T14:35:13.123Z'),
    IsIncoming: true,
    Message: "I got every word right, even...pneumono-ultramicroscopic-silico-volcano-coniosis!",
    FirstName: 'Twister',
    LastName: 'Rodriguez',
    PhoneNumber: '5551239999',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1019,
    CreationDate: new Date('2022-05-01T14:45:13.123Z'),
    IsIncoming: false,
    Message: "That's a miracle!",
    FirstName: 'Twister',
    LastName: 'Rodriguez',
    PhoneNumber: '5551239999',
    SMSPictureURLs: null,
  },
  {
    idInmateSMS: 1020,
    CreationDate: new Date('2022-05-05T14:55:13.123Z'),
    IsIncoming: true,
    Message: "The monkeys. OOOHHH!",
    FirstName: 'Twister',
    LastName: 'Rodriguez',
    PhoneNumber: '5551239999',
    SMSPictureURLs: null,
  },
];

const loremIpsum = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
  'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero',
  'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut',
  'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia',
  'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis', 
  'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',
  'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa',
  'volutpat', 'venenatis', 'sed', 'eu', 'molestie', 'lacus',
  'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus',
  'at', 'magna', 'vestibulum', 'turpis', 'ac', 'diam',
  'tincidunt', 'id', 'condimentum', 'enim', 'sodales', 'in',
  'hac', 'habitasse', 'platea', 'dictumst', 'aenean', 'neque',
  'fusce', 'augue', 'leo', 'eget', 'semper', 'mattis', 
  'tortor', 'scelerisque', 'nulla', 'interdum', 'tellus', 'malesuada',
  'rhoncus', 'porta', 'sem', 'aliquet', 'et', 'nam',
  'suspendisse', 'potenti', 'vivamus', 'luctus', 'fringilla', 'erat',
  'donec', 'justo', 'vehicula', 'ultricies', 'varius', 'ante',
  'primis', 'faucibus', 'ultrices', 'posuere', 'cubilia', 'curae',
  'etiam', 'cursus', 'aliquam', 'quam', 'dapibus', 'nisl',
  'feugiat', 'egestas', 'class', 'aptent', 'taciti', 'sociosqu',
  'ad', 'litora', 'torquent', 'per', 'conubia', 'nostra',
  'inceptos', 'himenaeos', 'phasellus', 'nibh', 'pulvinar', 'vitae',
  'urna', 'iaculis', 'lobortis', 'nisi', 'viverra', 'arcu',
  'morbi', 'pellentesque', 'metus', 'commodo', 'ut', 'facilisis',
  'felis', 'tristique', 'ullamcorper', 'placerat', 'aenean', 'convallis',
  'sollicitudin', 'integer', 'rutrum', 'duis', 'est', 'etiam',
  'bibendum', 'donec', 'pharetra', 'vulputate', 'maecenas', 'mi',
  'fermentum', 'consequat', 'suscipit', 'aliquam', 'habitant', 'senectus',
  'netus', 'fames', 'quisque', 'euismod', 'curabitur', 'lectus',
  'elementum', 'tempor', 'risus', 'cras'
];

const punctuate = function (sentence) {
	var word_length, num_commas, ii, position;
	
	word_length = sentence.length;
	
	/* End the sentence with a period. */
	sentence[word_length - 1] += '.';
	
	if (word_length < 4) {
		return sentence;
	}
	
	num_commas = getRandomCommaCount(word_length);
	
	for (ii = 0; ii <= num_commas; ii++) {
		position = Math.round(ii * word_length / (num_commas + 1));
		
		if (position < (word_length - 1) && position > 0) {
			/* Add the comma. */
			sentence[position] += ',';
		}
	}
	
	/* Capitalize the first word in the sentence. */
	sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
	
	return sentence;
};

/**
 * Produces a random number of commas.
 * @param {number} word_length Number of words in the sentence.
 * @return {number} Random number of commas
 */
const getRandomCommaCount = function (word_length) {
	var base, average, standard_deviation;
	
	/* Arbitrary. */
	base = 6;
	
	average = Math.log(word_length) / Math.log(base);
	standard_deviation = average / base;
	
	return Math.round(gaussMS(average, standard_deviation));
};

const getRandomSentenceLength = function () {
	return Math.round(
    Math.round(gaussMS(24.460, 5.080))
	);
};

const gauss = function () {
	return (Math.random() * 2 - 1) +
			(Math.random() * 2 - 1) +
			(Math.random() * 2 - 1);
};

const gaussMS = function (mean, standard_deviation) {
	return Math.round(gauss() * standard_deviation + mean);
};