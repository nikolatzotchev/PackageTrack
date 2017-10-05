package com.begin.controllers;

import io.restassured.RestAssured;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.hamcrest.Matchers.*;

@RunWith(SpringJUnit4ClassRunner.class) // start as spring application
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT) // bind to random HTTP port
public class DeviceControllerTest {

  // This is automatically set by spring test runner.
  @LocalServerPort
  private int port;

  @Before
  public void setup() {
    RestAssured.port = port;
    RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
  }


  @Test
  public void register_device_with_SerialNo_should_Pass() {
    int deviceId = RestAssured
      .given()
        .body("aa-bb-cc-dd")
      .when()
        .post("/api/devices/")
      .then()
        .time(lessThan(2000L))
        .statusCode(HttpStatus.OK.value())
        .body("serialNo", equalTo("aa-bb-cc-dd"))
      .extract().path("id");

    RestAssured
      .when()
        .get("/api/devices")
      .then()
        .time(lessThan(2000L))
        .body("serialNo", hasItem("aa-bb-cc-dd"))
        .body("id", hasItem(deviceId));
  }



  @Test
  public void register_device_without_SerialNo_should_Pass() {
    int deviceId = RestAssured
      .when()
        .post("/api/devices/")
      .then()
        .time(lessThan(2000L))
        .statusCode(HttpStatus.OK.value())
      .extract().path("id");

    RestAssured
      .when()
        .get("/api/devices")
      .then()
        .time(lessThan(2000L))
        .statusCode(HttpStatus.OK.value());
  }

  @Test
  public void allTrips_with_InexistentDevice_should_404() {
    RestAssured
        .when()
          .get("/api/devices/123456789/trips")
        .then()
          .statusCode(HttpStatus.NOT_FOUND.value());

    int deviceId = RestAssured
        .when()
          .post("/api/devices")
        .then()
          .statusCode(HttpStatus.OK.value())
          .body("id", notNullValue())
          .time(lessThan(2000L))
        .extract()
          .body().jsonPath().getInt("id");

    RestAssured
        .when()
          .get("/api/devices/" + deviceId + "/trips")
        .then()
          .statusCode(HttpStatus.OK.value())
          .time(lessThan(2000L));

    RestAssured
         .when()
           .get("/api/devices/" + deviceId + "/lastTrip")
         .then()
            .statusCode(HttpStatus.NOT_FOUND.value())
            .time(lessThan(2000L));
  }

}
