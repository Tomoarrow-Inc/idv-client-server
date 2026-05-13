FROM gradle:8-jdk21 AS development

WORKDIR /workspace/java

COPY java/ /workspace/java/
COPY test-board/ /workspace/test-board/
COPY --from=tomo-idv-client-java . /tomo-idv-client-java/

ENV TOMO_IDV_CLIENT_JAVA_PATH=/tomo-idv-client-java
ENV TEST_BOARD_PATH=/workspace/test-board/test-board.html
EXPOSE 3000

CMD ["gradle", "bootRun", "--no-daemon"]

FROM development AS build

RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine AS production

WORKDIR /app

COPY --from=build /workspace/java/build/libs/*.jar /app/app.jar
COPY --from=build /workspace/test-board /app/test-board

ENV TEST_BOARD_PATH=/app/test-board/test-board.html
EXPOSE 3000

CMD ["java", "-jar", "/app/app.jar"]
