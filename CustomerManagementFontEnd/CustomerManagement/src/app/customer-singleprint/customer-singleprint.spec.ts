import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSingleprint } from './customer-singleprint';

describe('CustomerSingleprint', () => {
  let component: CustomerSingleprint;
  let fixture: ComponentFixture<CustomerSingleprint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerSingleprint]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSingleprint);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
