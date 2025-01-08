import { CommonModule } from '@angular/common';
import {Component, computed, effect, inject, Signal, viewChild} from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { EntidadesService } from './services/entidades.service';
import { Entidad } from './interfaces/entidad';
import { MessageService } from 'primeng/api';
import {EntitiesComponent} from "../Components/entities/entities.component";
import {SIGNAL} from "@angular/core/primitives/signals";
import {ContactsComponent} from "../Components/contacts/contacts.component";

@Component({
  selector: 'app-entidades',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    EntitiesComponent,
    ContactsComponent
  ],
  templateUrl: './entidades.component.html',
  styleUrl: './entidades.component.css',
  providers: [MessageService]
})
export default class EntidadesComponent {
  public entidadesService = inject(EntidadesService);
  total = computed(() => this.entidadesService.entidades().length);
  selectedEntidades: Entidad[]=[];
  actionRoute = "/api/entities/store";
  actionContactRoute = "/api/contacts/store";
  actionMethod = "POST";
  hide:string = "hide";
  hideContact:string = "hide";
  labelButton:string ="";

  entitiesSignal:Signal<EntitiesComponent>= viewChild.required(EntitiesComponent);


  constructor(){
    effect(() => {
      this.entitiesSignal().hideChange.subscribe((e:Event)=>{
        this.entidadesService.refresh();
      });
    });
  }
  openNew() {
      if(this.hide === "hide"){
        this.labelButton = "Crear";
        this.hide = "";

      }else{
        this.hide="hide"
      }
  }

  openContact() {
    if(this.hideContact === "hide"){
      this.labelButton = "Crear";
      this.hideContact = "";

    }else{
      this.hideContact="hide"
    }
  }

  edit(entidad:Entidad){

  }

}
