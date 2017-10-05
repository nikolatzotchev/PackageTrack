package com.begin.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.notNullValue;

import io.restassured.RestAssured;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

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
  public void register_with_SerialNo_should_Pass() {
    int deviceId = RestAssured
        .given()
          .body("aa-bb-cc-dd")
        .when()
          .post("/api/devices")
        .then()
          .statusCode(HttpStatus.OK.value())
          .body("id", notNullValue())
          .body("serialNo", equalTo("aa-bb-cc-dd"))
        .extract()
         .body().jsonPath().getInt("id");

    // test if device can be listed
    RestAssured
        .when()
          .get("/api/devices")
        .then()
          .statusCode(HttpStatus.OK.value())
          .body("id", hasItem(deviceId))
          .body("serialNo", hasItem("aa-bb-cc-dd"));

  }

  @Test
  public void register_without_SerialNo_should_Pass() {
    int deviceId = RestAssured
        .when()
          .post("/api/devices")
        .then()
          .statusCode(HttpStatus.OK.value())
          .body("id", notNullValue())
        .extract()
          .body().jsonPath().getInt("id");

    // test if device can be listed
    RestAssured
        .when()
          .get("/api/devices")
        .then()
          .statusCode(HttpStatus.OK.value())
          .body("id", hasItem(deviceId));
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
        .extract()
          .body().jsonPath().getInt("id");

    RestAssured
        .when()
          .get("/api/devices/" + deviceId + "/trips")
        .then()
          .statusCode(HttpStatus.OK.value());
  }

}
