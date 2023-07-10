import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from './create-account/create-account.component';
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './overview/overview.component';
import { ProfileComponent } from './profile/profile.component';
import { LogoutComponent } from './logout/logout.component';
import { ProjectComponent } from './project/project.component';
import { ProjectAddComponent } from './project-add/project-add.component';
import { CompanyAccountComponent } from './company-account/company-account.component';
import { CompanyLoginComponent } from './company-login/company-login.component';
import { ProjectCompanyComponent } from './project-company/project-company.component';
import { OverviewCompanyComponent } from './overview-company/overview-company.component';
import { ProfileCompanyComponent } from './profile-company/profile-company.component';
import { AdminComponent } from './admin/admin.component';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { AuthGuard } from './service/auth.guard';
import { ReportComponent } from './report/report.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

const routes: Routes = [
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'login', component: LoginComponent },
  { path: 'overview', component: OverviewComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]},
  { path: 'project', component: ProjectComponent, canActivate: [AuthGuard]},
  { path: 'project-add', component: ProjectAddComponent, canActivate: [AuthGuard]},
  { path: 'company-account', component: CompanyAccountComponent },
  { path: 'company-login', component: CompanyLoginComponent},
  { path: 'overview-company', component: OverviewCompanyComponent, canActivate: [AuthGuard]},
  { path: 'project-company', component: ProjectCompanyComponent, canActivate: [AuthGuard]},
  { path: 'profile-company', component: ProfileCompanyComponent, canActivate: [AuthGuard]},
  { path: 'admin', component: AdminComponent},
  { path: 'admin-overview', component: AdminOverviewComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'report', component: ReportComponent},
  { path: 'error-dialog', component: ErrorDialogComponent },
  { path: 'confirm-dialog', component: ConfirmDialogComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
