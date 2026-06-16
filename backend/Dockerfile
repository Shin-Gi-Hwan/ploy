FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Cache dependencies separately from source
COPY gradle/ gradle/
COPY gradlew settings.gradle build.gradle ./
RUN ./gradlew dependencies --no-daemon -q

COPY src/ src/
RUN ./gradlew bootJar --no-daemon -x test

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
