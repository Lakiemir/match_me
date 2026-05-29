# Этап сборки
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Копируем файлы сборки Maven
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
COPY src src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]