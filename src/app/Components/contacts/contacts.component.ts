import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EnvInterface} from "../../../Interface/EnvInterface";
import {enviroment} from "../../../enviroment";
import FormMessageInterface from "../../../Interface/FormErrorInterface";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {NgClass,NgForOf,NgIf} from "@angular/common";
import {Entidad} from "../../entidades/interfaces/entidad";

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [NgClass, NgForOf, NgIf],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent  {
  @Input({required: true}) route = "";
  @Input({required: true}) method = "";
  @Input({required:true}) labelButton ="";
  env:EnvInterface = enviroment();
  @Input({required:true}) hide:string="";
  @Output() hideChange = new EventEmitter();

  #formMessage:FormMessageInterface= {message:"",type:""};
  alertState = this.#formMessage.type + "hide";
  messageList:Array<FormMessageInterface> = [];
  #name ="";
  #phone="";
  #email="";
  @Input({required:true}) entity:Entidad|null=null;
  isDisable =false;


  constructor(private http:HttpClient) {
  }


  get name(){
    return this.#name;
  }
  get phone(){
    return this.#phone;
  }
  get email(){
    return this.#email ;
  }




  onchange(e:Event){
    let target = e.target as HTMLInputElement;
    switch (target.name) {
      case "phone":
        this.#phone = target.value;
        break;
      case "email":
        this.#email = target.value;
        break;


      case "name":
        this.#name = target.value;
        break;

      default:
        throw new Error("Invalid Option");

    }
  }


  onSubmit(e:Event) {
    e.preventDefault();
    this.messageList =[];
    let regexp = new RegExp(/^(?=.{1,64})[a-za-z0-9!#$%&'+/=?^_{|}~-]+(?:\.[a-za-z0-9!#$%&'*+/=?^\_\{|}~-]+)@a-za-z0-9?(?:.a-za-z0-9?)$/);
    if (!regexp.test(this.#email) && this.#email.length > 191) {
      let message: FormMessageInterface = {message: "el valor de email no es valido", type: "error"};
      this.messageList.push(message)

      this.alertState = "";
    }
    if (this.entity == null ) {
      let message: FormMessageInterface = {
        message: "El valor de Entidad es requerido",
        type: "error"
      };
      this.messageList.push(message)
    }

    if (this.#name == "" || this.#name.length > 191) {
      let message: FormMessageInterface = {
        message: "El valor de nombre excede el numero de caracteres permitidos",
        type: "error"
      };
      this.messageList.push(message)
    }


    if (this.#phone.length > 191) {
      let message: FormMessageInterface = {message: "el valor de Telefono no es valido", type: "error"};
      this.messageList.push(message)
      this.isDisable = true;
    }

    if(this.messageList.length >=1) {
      this.alertState = "";
      this.isDisable=false;
      return ;
    }


    this.http.request(
      this.method,
      this.env.basePath+this.route,
      {
        headers:{
          'Content-type':"Application/json",
        },
        body: JSON.stringify({
          "name": this.#name,
          "entity_id": this.entity?.id,
          "phone": this.#phone,
          "email": this.#email
        }),
      }
    ).pipe( catchError(this.catchErrorEntities)).subscribe(async response => {
      this.messageList=[{message:"Entidad creada",type:"successfull"}];
      this.hide = "hide";
      this.hideChange.emit(true);
      this.alertState ="";
    });

  }


  catchErrorEntities(error:HttpErrorResponse) {

    this.messageList=[];

    let keyserror = error.error;
    let keys = Object.keys(keyserror);

    keys.forEach((key: string | number) => {

      keyserror[key].forEach((elem: any)=>{
        this.messageList.push({message:elem,type:"error"});
      })
    })

    this.hideChange.emit(true);
    this.alertState ="";
    return throwError(error.message);
  }
}
