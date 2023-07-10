import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { OverviewComponent } from './overview/overview.component';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LogoutComponent } from './logout/logout.component';
import { ProjectComponent } from './project/project.component';
import { ProjectAddComponent } from './project-add/project-add.component';
import { CompanyAccountComponent } from './company-account/company-account.component';
import { CompanyLoginComponent } from './company-login/company-login.component';
import { NabarCompanyComponent } from './nabar-company/nabar-company.component';
import { OverviewCompanyComponent } from './overview-company/overview-company.component';
import { ProjectCompanyComponent } from './project-company/project-company.component';
import { ProfileCompanyComponent } from './profile-company/profile-company.component';
import { BrowserModule } from '@angular/platform-browser';
import { AdminComponent } from './admin/admin.component';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { UniquePipe } from './unique.pipe';
import { JwtInterceptorService } from './service/jwt-interceptor.service';
import { ReportComponent } from './report/report.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MatMomentDateModule  } from '@angular/material-moment-adapter';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';




@NgModule({
  declarations: [
    AppComponent,
    CreateAccountComponent,
    LoginComponent,
    OverviewComponent,
    ProfileComponent,
    NavbarComponent,
    LogoutComponent,
    ProjectComponent,
    ProjectAddComponent,
    CompanyAccountComponent,
    CompanyLoginComponent,
    NabarCompanyComponent,
    OverviewCompanyComponent,
    ProjectCompanyComponent,
    ProfileCompanyComponent,
    AdminComponent,
    AdminOverviewComponent,
    UniquePipe,
    ReportComponent,
    ErrorDialogComponent,
    ConfirmDialogComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  MatNativeDateModule,
  BrowserAnimationsModule,
  MatMomentDateModule,
  MatDialogModule,
  ],
  providers: [ 
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true},
    { provide: MAT_DATE_LOCALE, useValue: 'en' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
