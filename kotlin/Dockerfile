# [LOCAL SDK BUILD] 로컬 SDK 테스트 시 아래 주석 해제 + build.gradle.kts에서 mavenLocal() 주석 해제 + 버전을 1.0.0-SNAPSHOT으로 변경
# FROM eclipse-temurin:21-jdk-alpine AS sdk-build
# WORKDIR /sdk
# COPY --from=tomo-idv-client-kotlin . .
# RUN ./gradlew publishToMavenLocal --no-daemon

# Stage 1: Build BFF (SDK is fetched from Maven Central)
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
# [LOCAL SDK BUILD] 로컬 SDK 테스트 시 아래 주석 해제
# COPY --from=sdk-build /root/.m2/repository /root/.m2/repository
COPY kotlin/ ./
COPY test-board/ /app/test-board/
RUN ./gradlew bootJar --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
COPY --from=build /app/test-board ./test-board
ENV TEST_BOARD_PATH=/app/test-board/test-board.html
EXPOSE 3000
ENTRYPOINT ["java", "-jar", "app.jar"]
