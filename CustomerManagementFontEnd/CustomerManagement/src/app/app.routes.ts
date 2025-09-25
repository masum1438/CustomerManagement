import { Routes } from '@angular/router';
import { CustomerList } from './customer-list/customer-list';
import { CustomerAdd } from './customer-add/customer-add';
import { CustomerUpdate } from './customer-update/customer-update';
import { CustomerDetails } from './customer-details/customer-details';
import { CustomerPrint } from './customer-print/customer-print';
import { CustomerSingleprint } from './customer-singleprint/customer-singleprint';
//{ CustomerList } from './customer-list';
export const routes: Routes = [
     { path: '', component: CustomerList  },  // default route
  { path: 'customer-list', component: CustomerList },
  { path: 'customer-add', component: CustomerAdd },
  { path: 'customer-update/:id', component: CustomerUpdate },
  { path: 'customer-details/:id', component: CustomerDetails },
  { path: 'customer-singleprint/:id', component: CustomerSingleprint },
  { path: 'customer-print', component: CustomerPrint }, 
   // single print
 // { path: 'customers/print-all', component: CustomerPrintComponent },  // full list print
  { path: '**', component: CustomerList  } 
];
