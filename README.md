# Customer Management System

## Project Overview
The **Customer Management System** is a full stack customer management system.Its font-end create using angular and bootstrap.Back-end create using asp.net core web api and database manage using PostgreSql.Back-end generate CRUD API.By using this api font-end angular system can manage customer system( create,update,read and delete ).
Here also contains Search box which can filter or search in the customer list using name,email and phone no. Full customer list and single customer print option available here.Finally,we can say that by using this system controller can manage the customer info.

---

## Features
- **Customer Management**: Add, view, edit, and delete customer details.
- **Search & Filter**: Real-time search by name, email, or phone.
- **Printing**: Print all customers or individual customer details.
- **API Integration**: RESTful APIs with Angular `HttpClient` and Observables.
- **Database**: PostgreSQL with Entity Framework Core for data handling.

---

## Technology Stack
- **Frontend**: Angular,Bootstrap, HTML, CSS
- **Backend**: ASP.NET Core, C#, Entity Framework Core
- **Database**: PostgreSQL
---

## Project Structure

**Backend (ASP.NET Core)**
|-- Controllers
|   |-- CustomersController.cs
|   `-- WeatherForecastController.cs
|-- Data
|   `-- AppDbContext.cs
|-- Migrations
|   |-- 20250923092148_connectionDb.Designer.cs
|   |-- 20250923092148_connectionDb.cs
|   `-- AppDbContextModelSnapshot.cs
|-- Model
|   `-- Customer.cs
`-- Program.cs

**Frontend (Angular)**
|-- app
|   |-- app.config.ts
|   |-- app.css      
|   |-- app.html     
|   |-- app.routes.ts
|   |-- app.spec.ts  
|   |-- app.ts       
|   |-- customer-add
|   |   |-- customer-add.css    
|   |   |-- customer-add.html   
|   |   |-- customer-add.spec.ts
|   |   `-- customer-add.ts
|   |-- customer-details
|   |   |-- customer-details.css
|   |   |-- customer-details.html
|   |   |-- customer-details.spec.ts
|   |   `-- customer-details.ts
|   |-- customer-list
|   |   |-- customer-list.css
|   |   |-- customer-list.html
|   |   |-- customer-list.spec.ts
|   |   `-- customer-list.ts
|   |-- customer-print
|   |   |-- customer-print.css
|   |   |-- customer-print.html
|   |   |-- customer-print.spec.ts
|   |   `-- customer-print.ts
|   |-- customer-singleprint
|   |   |-- customer-singleprint.css
|   |   |-- customer-singleprint.html
|   |   |-- customer-singleprint.spec.ts
|   |   `-- customer-singleprint.ts
|   |-- customer-update
|   |   |-- customer-update.css
|   |   |-- customer-update.html
|   |   |-- customer-update.spec.ts
|   |   `-- customer-update.ts
|   |-- customer.model.ts
|   `-- customer.service.ts
|-- environment.ts
|-- index.html
|-- main.ts
`-- styles.css

---


