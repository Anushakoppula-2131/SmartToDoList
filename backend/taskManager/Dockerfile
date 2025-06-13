FROM openjdk:17-jdk-alpine
WORKDIR /app


COPY target/demo-0.0.1-SNAPSHOT.jar add.jar

EXPOSE 8080
CMD ["java", "-jar", "add.jar"]