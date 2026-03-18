FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY kotlin/ ./kotlin/
COPY test-board/ ./test-board/
WORKDIR /app/kotlin
RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/kotlin/build/libs/*.jar app.jar
COPY --from=build /app/test-board ./test-board
ENV TEST_BOARD_PATH=/app/test-board/test-board.html
EXPOSE 3000
ENTRYPOINT ["java", "-jar", "app.jar"]
