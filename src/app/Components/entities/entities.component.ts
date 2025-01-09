import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MessageService} from "primeng/api";
import {EnvInterface} from "../../../Interface/EnvInterface";
import {enviroment} from "../../../enviroment";
import FormMessageInterface from "../../../Interface/FormErrorInterface";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {Entidad} from "../../entidades/interfaces/entidad";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

// @ts-ignore
@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [NgClass, NgForOf, NgIf, ReactiveFormsModule],
  templateUrl: './entities.component.html',
  styleUrl: './entities.component.css'
})


export class EntitiesComponent {
  @Input({required: true}) route = "";
  @Input({required: true}) method = "";
  @Input({required:true}) labelButton ="";
  @Input() entity:Entidad|null = null;
  env:EnvInterface = enviroment();
  @Input({required:true}) hide:string="";
  @Output() hideChange = new EventEmitter();
  #formMessage:FormMessageInterface= {message:"",type:""};
  alertState = this.#formMessage.type + "hide";
  messageList:Array<FormMessageInterface> = [];
  #name ="";
  #address="";
  #phone="";
  #email="";
  #nit=""
  isDisable =false;

  form = new FormGroup({
    name: new FormControl(this.#name,),
    nit: new FormControl(this.#nit),
    address: new FormControl(this.#address),
    phone: new FormControl(this.#phone),
    email: new FormControl(this.#email),
  })

  constructor(private http:HttpClient) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.entity!=null){
      this.#name = this.entity.name;
      this.#address = this.entity.address??"";
      this.#phone = this.entity.phone??"";
      this.#email = this.entity.email??"";
      this.#nit = this.entity.nit;
    }
  }
  get name(){
    return this.#name;
  }
  get address(){
    return this.#address;
  }
  get phone(){
    return this.#phone;
  }
  get email(){
    return this.#email ;
  }
  get nit(){
    return this.#nit;
  }



onSubmit(e:Event) {
  e.preventDefault();
  this.messageList =[];
  let regexp = new RegExp(/^(?=.{1,64})[a-za-z0-9!#$%&'+/=?^_{|}~-]+(?:\.[a-za-z0-9!#$%&'*+/=?^\_\{|}~-]+)@a-za-z0-9?(?:.a-za-z0-9?)$/);
  if (!regexp.test(this.form.value.email!) && this.form.value.email!.length > 191) {
    let message: FormMessageInterface = {message: "el valor de email no es valido", type: "error"};
    this.messageList.push(message)

    this.alertState = "";
  }
  if (this.form.value.nit == "" || this.form.value.nit!.length > 191) {
    let message: FormMessageInterface = {
      message: "El valor de NIT excede el numero de caracteres permitidos",
      type: "error"
    };
    this.messageList.push(message)
  }

  if (this.form.value.name == "" || this.form.value.name!.length > 191) {
    let message: FormMessageInterface = {
      message: "El valor de nombre excede el numero de caracteres permitidos",
      type: "error"
    };
    this.messageList.push(message)
  }

  if (this.form.value.address!.length > 191) {
    let message: FormMessageInterface = {message: "el valor de Dirección no es valido", type: "error"};

    this.messageList.push(message)

    this.alertState = "";
    this.isDisable = true;

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
        "name": this.form.value.name,
        "nit": this.form.value.nit,
        "address": this.form.value.address,
        "phone": this.form.value.phone,
        "email": this.form.value.email
      }),
    }
  ).pipe( catchError(this.catchErrorEntities)).subscribe(async response => {

      this.hide = "hide";
      this.hideChange.emit(true);
      this.alertState ="";
      this.entity = null;

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
