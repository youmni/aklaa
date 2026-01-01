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

## Sources
1. [@Spring-documentation](https://spring.io/)
2. [@Baeldung](https://www.baeldung.com/spring-boot)
3. [@Relations: Many to Many](https://www.baeldung.com/jpa-many-to-many)
4. [@Relations: One to Many](https://www.baeldung.com/hibernate-one-to-many)
5. [@JWT-token](https://connect2id.com/products/nimbus-jose-jwt)
6. [@Dependency injection](https://medium.com/@reetesh043/spring-boot-dependency-injection-137f85f84590)
7. [@Axios-interceptor](https://chatgpt.com/share/691a3235-011c-8007-9fa3-ed87f5d72c5d)
8. [@JpaSpecificationExecutor](https://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaSpecificationExecutor.html)
9. [@Lombok](https://www.baeldung.com/intro-to-project-lombok)
10. [@Javadoc](https://www.baeldung.com/javadoc)
11. [@Minio-setup](https://chatgpt.com/share/691e1722-a328-8010-96ba-904168f98fe5)
12. [@Minio-bucket-policy](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketPolicy.html)
13. [@Return-file-exported-data](https://www.baeldung.com/spring-controller-return-image-file)
14. [@Security-headers-api](https://chatgpt.com/share/694479ba-eb74-8007-89d5-2114415b74f2)
15. [@Chakra-UI](https://chakra-ui.com/)
16. [@Used-repo-Flipflow](https://github.com/youmni/flipflow)
17. [@Used-repo-SafeCircle](https://github.com/youmni/safecircle_backend)
18. [@Vite](https://vite.dev/)
19. [@Validation](https://www.baeldung.com/spring-boot-bean-validation)

## AI Prompts Used  
*Claude 4.5 Sonnet (VS Code)*

The following AI prompts were used during development:

### Documentation
- Generate Javadoc for all interfaces, including:
  - Title  
  - Overview  
  - Parameters  
  - Return values  
  - Exceptions  

### Infrastructure / Storage
- Help me configure MinIO to create a public bucket programmatically.

### Email Templates
- Based on the registration email properties, create the registration email template using CSS.
- Based on the registration email, generate the email template for `sendPasswordResetEmail`.
- Based on the registration email, generate the email template for `sendActivationUpdatedEmail`.

### Styling
- I’m using **Chakra UI**. Can you make this page look nicer by improving the layout, spacing, typography and overall visual consistency without changing the logic.


> **Note**  
> The prompts also included context files to give the AI sufficient background about the existing codebase and structure.

## Generative AI disclosure
AI tools were used to assist with this project, as referenced in the links and VS Code prompts above. All content produced with AI was carefully reviewed to ensure full understanding and accuracy. While pushing in VS Code, the 'Generate Commit Message' feature was used. Inline completion was also used for styling (frontend).


## Author
- [@Youmni Malha](https://github.com/Youmni)