import { Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CredentialsComponent } from './credentials/credentials.component';
import { BackupComponent } from './backup/backup.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TasksComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'credentials', component: CredentialsComponent },
  { path: 'backup', component: BackupComponent },
];
