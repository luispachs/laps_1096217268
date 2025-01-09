import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { StateEntidad } from '../interfaces/state-entidad';
import { Entidad } from '../interfaces/entidad';
import {enviroment} from "../../../enviroment";
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {
  private http = inject(HttpClient)
  url: string = "http://127.0.0.1:8000/api/"
  #state = signal<StateEntidad>({
    loading: true,
    entidades: []
  })

  entidades = computed(() => this.#state().entidades);
  loading = computed(() => this.#state().loading);
  constructor() {
    this.url =enviroment().basePath+"/api/entities"
    this.refresh();
  }

  /** Método para refrescar los datos */
  refresh(): void {
    this.#state.set({ loading: true, entidades: [] }) // Actualiza el estado a "cargando" y vacia las entidades
    this.http.get<Entidad[]>(this.url).subscribe({
      next: (res) => {
        this.#state.set({
          loading: false,
          entidades: res,
        });
      },
      error: (error) => {
        console.error('Error al cargar entidades:', error);
      }
    });
  }
  delete(entidad: Entidad): void {
    this.http.delete<Entidad>(`${this.url}/${entidad.id}`).subscribe({
      next: (res) => {
        this.refresh();
      },
      error: (error) => {
        console.error('Error al eliminar la entidad:', error);
      }
    });
  }

  deleteMuch(entities:Entidad[]){

    let entitiesId:number[] = entities.map(elem=>elem.id);
    console.log([entities,entitiesId]);
    this.http.delete(this.url,{
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({entities: entitiesId})
    }).subscribe({
      next: (res) => {
      },
      error: (error) => {
        throw new Error(error.message);
      },
      complete: () => {
        this.refresh();
      }
    });

    return 0;
  }
}
