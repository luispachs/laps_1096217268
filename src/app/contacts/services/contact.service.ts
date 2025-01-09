  import { Injectable } from '@angular/core';
  import {HttpClient} from "@angular/common/http";
  import {Contact} from "../Interface/Contact";
  import {enviroment} from "../../../enviroment";

@Injectable({
  providedIn: 'root'
})
export class ContactService  {
  contactList:Contact[]=[];
  constructor(private http: HttpClient) {

  }

  getContactList(){
    return this.http.get(enviroment().basePath+"/api/contacts/");
  }
  delete(contact:Contact){}
}
