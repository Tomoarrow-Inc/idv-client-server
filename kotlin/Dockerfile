# Stage 1: Build SDK → publish to local Maven repo
FROM eclipse-temurin:21-jdk-alpine AS sdk-build
WORKDIR /sdk
COPY --from=tomo-idv-client-kotlin . .
RUN ./gradlew publishToMavenLocal --no-daemon

# Stage 2: Build BFF with SDK from local Maven
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY --from=sdk-build /root/.m2/repository /root/.m2/repository
COPY kotlin/ ./
COPY test-board/ /app/test-board/
RUN ./gradlew bootJar --no-daemon

# Stage 3: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
COPY --from=build /app/test-board ./test-board
ENV TEST_BOARD_PATH=/app/test-board/test-board.html
EXPOSE 3000
ENTRYPOINT ["java", "-jar", "app.jar"]
