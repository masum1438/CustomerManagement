import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-print',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './customer-print.html',
  styleUrl: './customer-print.css'
})
export class CustomerPrint implements OnInit {
customers: Customer[] = [];
  singleCustomer?: Customer;
  isSingle = false;

  constructor(private service: CustomerService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isSingle = true;
      const id = Number(idParam);
      this.service.getById(id).subscribe(c => { this.singleCustomer = c; setTimeout(()=>window.print(), 300); });
    } else {
      this.service.getAll().subscribe(list => { this.customers = list; setTimeout(()=>window.print(), 300); });
    }
  }

  back() { this.router.navigate(['customer-list']); }
}
