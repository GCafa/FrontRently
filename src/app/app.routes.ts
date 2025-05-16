import {RouterModule, Routes} from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordResetComponent} from './components/password-reset/password-reset.component';
import {HomeComponent} from './components/home/home.component';
import {ChiSiamoComponent} from './components/chi-siamo/chi-siamo.component';

import {NgModule} from '@angular/core';

export const routes: Routes = [
  {
    path:'home',
    component: HomeComponent,
  },
  {
    path: 'passwordReset',
    component: PasswordResetComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'chi-siamo',
    component: ChiSiamoComponent,
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }

];


