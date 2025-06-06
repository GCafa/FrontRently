import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ChiSiamoComponent } from './components/chi-siamo/chi-siamo.component';
import { PersonalAreaComponent } from './components/personal-area/personal-area.component';
import { NgModule } from '@angular/core';
import { UserModifyComponent } from './components/user-modify/user-modify.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {AdminHomeComponent} from './components/admin-home/admin-home.component';
import {ChangeRoleComponent} from './components/change-role/change-role.component';
import {RechargeBalanceComponent} from './components/recharge-balance/recharge-balance.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'chi-siamo', component: ChiSiamoComponent },
  { path: 'user-modify', component: UserModifyComponent },
  { path: 'user-home', component: UserHomeComponent },
  { path: 'admin-home', component: AdminHomeComponent},
  { path: 'change-role', component: ChangeRoleComponent },
  { path: 'recharge-balance', component: RechargeBalanceComponent },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'personal-area',
    loadComponent: () => import('./components/personal-area/personal-area.component').then(m => m.PersonalAreaComponent)
  }
];
