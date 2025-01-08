import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {enviroment} from "../../enviroment";
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  public entities:any = []
  constructor(private http: HttpClient) {
    http.get(
      enviroment().basePath+"/api/contacts"
    ).subscribe((resp)=>{
      console.log(resp);
      this.entities = resp;
    })
  }

}
