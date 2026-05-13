FROM eclipse-temurin:21-jdk-alpine AS sdk-build
WORKDIR /sdk
COPY --from=tomo-idv-client-kotlin . .
RUN ./gradlew publishToMavenLocal -PskipSigning=true --no-daemon

# Stage 1: Build BFF against the local SDK generated from the current contract.
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY --from=sdk-build /root/.m2/repository /root/.m2/repository
COPY kotlin/ ./
COPY test-board/ /app/test-board/
RUN ./gradlew test bootJar --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
COPY --from=build /app/test-board ./test-board
ENV TEST_BOARD_PATH=/app/test-board/test-board.html
EXPOSE 3000
ENTRYPOINT ["java", "-jar", "app.jar"]
