import { Routes } from '@angular/router';
import EntidadesComponent from './entidades/entidades.component';
import ContactsComponent from "./contacts/contacts.component";
export const routes: Routes = [
   {
      path: 'entidades',
      component: EntidadesComponent
    },
  {
    path: 'contactos',
    component: ContactsComponent
  },
  {
    path: '**',
    component: EntidadesComponent
  },
];
