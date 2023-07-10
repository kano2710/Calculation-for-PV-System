import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NabarCompanyComponent } from './nabar-company.component';

describe('NabarCompanyComponent', () => {
  let component: NabarCompanyComponent;
  let fixture: ComponentFixture<NabarCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NabarCompanyComponent]
    });
    fixture = TestBed.createComponent(NabarCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
