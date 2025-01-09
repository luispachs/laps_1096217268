import {Component, Inject} from '@angular/core';
import {ContactService} from "./services/contact.service";
import {RouterOutlet} from "@angular/router";
import {Contact} from "./Interface/Contact";
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {MessageService, PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    Button,
    CardModule,
    PrimeTemplate,
    TableModule,
    ToastModule,
    ToolbarModule,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
  providers: [MessageService,ContactService]
})
export default class ContactsComponent {

  contactList:Contact[] =[];
  selectedContact:Contact[] =[]

  constructor(public contactService:ContactService,) {
    this.contactService.getContactList().subscribe(
      resp=>{
        this.contactList = resp as Contact[];
      }
    );
  }

  openNew(){}
  onDestroy(){
  }

  edit(contact:Contact){

  }

  total(){
    return this.contactList.length;
  }

}
