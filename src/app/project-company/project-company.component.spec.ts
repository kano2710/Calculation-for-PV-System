import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCompanyComponent } from './project-company.component';

describe('ProjectCompanyComponent', () => {
  let component: ProjectCompanyComponent;
  let fixture: ComponentFixture<ProjectCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectCompanyComponent]
    });
    fixture = TestBed.createComponent(ProjectCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
