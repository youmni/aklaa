# Aklaa

## Overview
**Aklaa** is an application that automatically generates shopping lists based on the meals or individual products entered by the user. It allows users to manage recipes, plan their weekly meals, and customize the generated shopping list by adding or removing ingredients. Pdf export soon!

## Installation

### Requirements
- **Docker:** Required to run the full stack with Docker Compose. [Install Docker](https://docs.docker.com/get-started/get-docker/)  
- **JDK 21:** Ensure you have JDK 21 installed to run the Spring Boot backend. [Install JDK 21](https://www.oracle.com/java/technologies/downloads/#jdk21-windows)  
- **Node.js ≥ 22:** Required to run the React Vite frontend locally if needed. [Install Node.js](https://nodejs.org/en/download)

### Steps
1. **Clone the project from GitHub:**
```bash
git clone https://github.com/youmni/aklaa.git
cd aklaa 
```

2. **Copy `.env.example` to `.env` in the root of the project**:

3. **API folder: Add `application.properties`**

Go to the **API** folder and place an `application.properties` file inside the **resources** directory.  
This file ensures that the database is properly created and updated. You may configure it as you prefer; the example below is a common setup:

```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

5. **Start the project with Docker Compose**:
```bash
docker compose up -d --build
```

6. **Stop the project with Docker Compose**:
```bash
docker compose down
```

## Documentation

### Swagger
- **Swagger UI:**  
  - `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON:**  
  - `http://localhost:8080/v3/api-docs`
- **OpenAPI YAML:**  
  - `http://localhost:8080/v3/api-docs.yaml`

## Technologies
1. **Docker**: Used for building the backend of the application.
2. **MySQL**: Used for managing the database.
3. **Spring Boot**: Used for building the backend of the application.
4. **React JS**: Used for managing the database.
5. **Minio**: Used for image storage.

## Author
- [@Youmni Malha](https://github.com/Youmni)
