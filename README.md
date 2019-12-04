**Spring-Boot and Angular e-commerce app**

### Technologies
- Java 8
- Angular 8
- Spring Boot 2
- Docker

### Features:
1. User authentication  and access control with Json Web Token 
2. Spring actuator to monitor API usage including /health endpoint
3. Swagger for API documentation
4. Spring Boot based Restful API including HATEOAS, Validation, Exception Handling
5. App uses h2 in memory database for testing and mysql database while app is running
6. Adding product to shopping cart without logging into application
7. CRUD operations on product, shopping cart, shopping list and creating order
8. Admin role can add/update/delete products

## Build and Deploy
### To run the backend application with maven installed:
Set up mysql 
 - create database 'shopbiz' in mysql 
 - update mysql credentials in application.properties located at src/main/resources
 - All tables will be created and intial data will be imported automatically from data.sql file by Spring Boot

Navigate to shopbiz directory

 -```$ cd shopbiz```
 
Run as spring-boot application 

```$ mvn spring-boot:run```

Swagger documentation available at - http://localhost:8080/shopbiz/swagger-ui.html#/

In browser navigate to http://localhost:8080/shopbiz/

HAL browser will list available REST API endpoints.

### To run frontend with Angular CLI and NodeJS
- navigate to shopbiz-UI
```
$ cd shopbiz-UI
$ npm install
$ ng serve
```
Frontend will be running at http://localhost:4200

## Deploy Using Docker
- Run docker compose from project root
 
  -```$ docker-compose up --build```
- This will deploy whole application where UI is served from ngnix server,  backend API redirected with nginx proxy and MySQL with persistent volume to store data after removing mysql container and creating new one.
- Navigate to http://localhost to view running app

### To login 
 - Customer role 
   -  email - customer@test.com 
   -  password - password 
 - Admin role 
   - email - admin@test.com
    - password - password





