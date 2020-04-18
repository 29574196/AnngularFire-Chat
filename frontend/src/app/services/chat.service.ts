import { Injectable } from '@angular/core';
import {AngularFireDatabase,AngularFireList} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from '../services/auth.service';
import * as firebase from 'firebase/app';
import {ChatMessage} from '../models/chat.message.model'
import { Observable } from 'rxjs';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user: any;
  chatMessages: AngularFireList<ChatMessage[]>;
  chatMessage: ChatMessage;
  userName: Observable<string>;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe(auth => {
      if(auth !== undefined && auth !== null)
      {
        this.user = auth;
      }
    })
   }

  sendMessage(msg: string){
    
    const timeStamp = this.getTimeStamp();
    const email = this.user.email;
    this.chatMessages = this.getMessages();
    this.chatMessages.push({
      message: msg,
      timeSent: timeStamp,
      userName: this.userName,
      email: email
    })
  }

  getMessages(): AngularFireList<ChatMessage[]>
  {
    //query to create our messagelist binding
    return this.db.list('messages',ref => {
      let query =ref.limitToLast(25).orderByKey();
      return query;
    });
  }

  getTimeStamp(){
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
                  (now.getUTCMonth() + 1) + '/' +
                  now.getUTCDate();
    
    const time = now.getUTCHours() + ':' +
                  (now.getUTCMinutes() + 1) + ':' +
                  now.getUTCSeconds();

    return (date + ' '+time);
  }
}
