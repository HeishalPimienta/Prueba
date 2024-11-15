import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { CalendarComponent } from './componentes/calendar/calendar.component';
import { AgendaComponent } from './componentes/agenda/agenda.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './componentes/register/register.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reg', component: RegisterComponent },
  { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard] },
  { path: 'calendario', component: CalendarComponent, canActivate: [AuthGuard] },
];
