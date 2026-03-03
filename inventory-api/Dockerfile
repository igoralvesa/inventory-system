# Build stage - use Maven image to avoid wrapper SHA validation issues
FROM maven:3.9.12-eclipse-temurin-25 AS build
WORKDIR /app

COPY pom.xml .
COPY src src

RUN mvn package -DskipTests -q

# Runtime stage
FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=build /app/target/quarkus-app/lib/ /app/lib/
COPY --from=build /app/target/quarkus-app/*.jar /app/
COPY --from=build /app/target/quarkus-app/app/ /app/app/
COPY --from=build /app/target/quarkus-app/quarkus/ /app/quarkus/

EXPOSE 8080
ENV JAVA_OPTS_APPEND="-Dquarkus.http.host=0.0.0.0"
ENV JAVA_APP_JAR="/app/quarkus-run.jar"

ENTRYPOINT ["java", "-jar", "/app/quarkus-run.jar"]
