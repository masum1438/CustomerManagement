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
## Back-End overview
<img width="1168" height="646" alt="getall" src="https://github.com/user-attachments/assets/cf1191bf-5a76-40fb-95a5-cad6c0bc39f9" />
<img width="1168" height="508" alt="getid" src="https://github.com/user-attachments/assets/04cca250-c0e6-44a4-95eb-d5ab6cb28c7a" />
<img width="1168" height="514" alt="post" src="https://github.com/user-attachments/assets/3ba637b2-8a11-4cdf-b9b8-015c25e53ec6" />
<img width="1168" height="495" alt="put" src="https://github.com/user-attachments/assets/0cc8b0ef-5463-459d-82fd-c28bf3b5b5e1" />
<img width="1168" height="546" alt="Delete" src="https://github.com/user-attachments/assets/af83cde7-2af9-4dba-bced-de3a60860bf4" />


---
## Font-End overview
<img width="1170" height="564" alt="list" src="https://github.com/user-attachments/assets/6932a982-f3be-4962-a053-774a0284fcf8" />
<img width="1170" height="451" alt="search" src="https://github.com/user-attachments/assets/9237aca4-7a22-4489-84be-96ca8fed5f38" />

<img width="1170" height="618" alt="Add" src="https://github.com/user-attachments/assets/a94592de-3956-466b-9f80-77b9a84fc519" />
<img width="1170" height="583" alt="edit" src="https://github.com/user-attachments/assets/c7da107f-90b6-4ad2-819e-3048c120546c" />
<img width="1170" height="487" alt="details" src="https://github.com/user-attachments/assets/d40e6016-9aa7-41e6-b8fd-44776635ebbc" />
<img width="1170" height="532" alt="delete" src="https://github.com/user-attachments/assets/75c0d76a-b44c-4315-b71a-05574c8f1cbc" />

<img width="1170" height="608" alt="printall" src="https://github.com/user-attachments/assets/cf0dc1db-4a9d-44eb-afc5-afe372cd58cb" />
<img width="1170" height="623" alt="singleprint" src="https://github.com/user-attachments/assets/76fe7a4a-9c69-47a5-9536-daa9510b012c" />


---
## Project Structure
**Backend (ASP.NET Core)**
```tex
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
```
**Frontend (Angular)**
```tex
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
```
---


