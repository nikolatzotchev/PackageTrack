package com.begin.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.lessThan;
import static org.hamcrest.Matchers.notNullValue;

import com.begin.dto.CreateTripDTO;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class) // start as spring application
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
// bind to random HTTP port
public class TripControllerTest {

  @LocalServerPort
  private int port;

  @Before
  public void setup() {
    RestAssured.port = port;
    RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
  }

  @Test
  public void create_device_trip_with_description() {

    int deviceId = RestAssured
        .when()
        .post("/api/devices")
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("id", notNullValue())
        .time(lessThan(2000L))
        .extract()
        .body().jsonPath().getInt("id");

    CreateTripDTO createTripDTO = new CreateTripDTO();
    createTripDTO.setDeviceId(Long.valueOf(deviceId));
    createTripDTO.setDescription("trip to sofia");

    int tripId = RestAssured
        .given()
        .body(createTripDTO)
        .contentType(ContentType.JSON)
        .when()
        .post("/api/trips")
        .then()
        .time(lessThan(2000L))
        .statusCode(HttpStatus.OK.value())
        .body("description", equalTo("trip to sofia"))
        .extract().jsonPath().getInt("id");

    RestAssured
        .when()
        .get("/api/trips/" + tripId + "/")
        .then()
        .time(lessThan(2000L))
        .statusCode(HttpStatus.OK.value())
        .body("description", equalTo("trip to sofia"))
        .body("startTime", equalTo(null));

    RestAssured
        .given()
        .body(tripId)
        .when()
        .post("/api/trips/" + tripId + "/startTrip")
        .then()
        .time(lessThan(2000L))
        .body("startTime", notNullValue());
  }
}
