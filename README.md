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

2. **Create the `.env` file in the root of the project**:

```dotenv
# MySQL
MYSQL_ROOT_PASSWORD=[db_root_password]
MYSQL_DATABASE=[db_name]
MYSQL_USER=[db_user]
MYSQL_PASSWORD=[db_password]

# Spring Boot
SPRING_DATASOURCE_URL=[JDBC_url]
SPRING_DATASOURCE_USERNAME=[user]
SPRING_DATASOURCE_PASSWORD=[password]

SPRING_PROFILES_ACTIVE=[dev or prod]

SPRING_MAIL_HOST=[smtp]
SPRING_MAIL_PORT=[port]
SPRING_MAIL_USERNAME=[username]
SPRING_MAIL_PASSWORD=[password]
SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true
SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true
SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_REQUIRED=true

FRONTEND_URL=[frontend_url]
JWT_SECRET=[jwt_secret]

# React
VITE_BACKEND_URL=[backend_url]
VITE_DEFAULT_IMAGE_URL=[default_image_url]

# MinIO
MINIO_ENDPOINT=[minio_endpoint_url]
MINIO_ENDPOINT_EXTERN=[minio_extern_endpoint_url]
MINIO_ACCESS_KEY=[access_key]
MINIO_SECRET_KEY=[secret_key]
MINIO_BUCKET_NAME=[bucket_name_for_dishes]
```

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

### Authors
- [@Youmni Malha](https://github.com/Youmni)
