import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { userGuard } from './user.guard';
import { managerGuard } from './manager.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/resource-form', pathMatch: 'full' },

  { 
    path: 'resource-form', 
    loadComponent: () => import('./resource-form/resource-form.component').then(m => m.ResourceFormComponent),  
    canActivate: [authGuard, userGuard] 
  },

  { 
    path: 'resource-table', 
    loadComponent: () => import('./resource-table/resource-table.component').then(m => m.ResourceTableComponent),  
    canActivate: [authGuard] 
  },

  { 
    path: 'request-pool', 
    loadComponent: () => import('./request-pool/request-pool.component').then(m => m.RequestPoolComponent),  
    canActivate: [authGuard, managerGuard] 
  },

  { 
    path: 'login', 
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) 
  }
];
