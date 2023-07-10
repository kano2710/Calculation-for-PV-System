import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewCompanyComponent } from './overview-company.component';

describe('OverviewCompanyComponent', () => {
  let component: OverviewCompanyComponent;
  let fixture: ComponentFixture<OverviewCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewCompanyComponent]
    });
    fixture = TestBed.createComponent(OverviewCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
