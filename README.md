# Aklaa

## Overview
**Aklaa** is an application that automatically generates shopping lists based on the meals or individual products entered by the user. It allows users to manage recipes, plan their weekly meals, and customize the generated shopping list by adding or removing ingredients. All recipes and shopping lists can be exported as PDFs for easy reference.

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
Rename the env.example file to .env. Then fill in all values with the correct information for your environment.

3. **Start the project with Docker Compose**:
```bash
docker compose up -d --build
```

4. **Stop the project with Docker Compose**:
```bash
docker compose down
```

> **Note:** Make sure step 3 and 4 are performed in the root directory.

## Technologies
1. **Docker**: Used for building the backend of the application.
2. **MySQL**: Used for managing the database.
3. **Spring Boot**: Used for building the backend of the application.
4. **React JS**: Used for managing the database.
5. **Minio**: Used for image storage.

### Sources
1. [@Relations: Many to Many](https://www.baeldung.com/jpa-many-to-many)
2. [@Relations: One to Many](https://www.baeldung.com/hibernate-one-to-many)
3. [@Validation](https://www.baeldung.com/spring-boot-bean-validation)
4. [@JWT-token](https://connect2id.com/products/nimbus-jose-jwt)
6. [@Dependency injection](https://medium.com/@reetesh043/spring-boot-dependency-injection-137f85f84590)
7. [@Access-token refresh](https://chatgpt.com/share/691a3235-011c-8007-9fa3-ed87f5d72c5d)
8. [@JpaSpecificationExecutor](https://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaSpecificationExecutor.html)
9. [@Lombok](https://www.baeldung.com/intro-to-project-lombok)

### Authors
- [@Youmni Malha](https://github.com/Youmni)
