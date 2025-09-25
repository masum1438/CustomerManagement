import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPrint } from './customer-print';

describe('CustomerPrint', () => {
  let component: CustomerPrint;
  let fixture: ComponentFixture<CustomerPrint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerPrint]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerPrint);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
