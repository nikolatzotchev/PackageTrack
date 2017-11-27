package com.begin.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.lessThan;
import static org.hamcrest.Matchers.notNullValue;

import com.begin.dto.CreateTripDTO;
import com.begin.dto.TripConfigurationDTO;
import com.begin.entities.TripConfiguration;
import com.begin.entities.Value.Metric;
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

  private static final String deviceControllerUrl = "/api/v1/devices";
  private static final String tripControllerUrl = "/api/v1/trips";

  @Before
  public void setup() {
    RestAssured.port = port;
    RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
  }

  @Test
  public void create_device_trip_with_description() {

    int deviceId = RestAssured
        .when()
        .post(deviceControllerUrl)
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("id", notNullValue())
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
        .post(tripControllerUrl)
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("description", equalTo("trip to sofia"))
        .extract().jsonPath().getInt("id");

    RestAssured
        .when()
        .get(tripControllerUrl + "/" + tripId + "/")
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("description", equalTo("trip to sofia"))
        .body("startTime", equalTo(null));

    RestAssured
        .given()
        .body(tripId)
        .when()
        .post(tripControllerUrl +"/" + tripId + "/startTrip")
        .then()
        .body("startTime", notNullValue());
  }

  @Test
  public void trip_configuration_should_pass() {

    int deviceId = RestAssured
        .when()
        .post(deviceControllerUrl)
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("id", notNullValue())
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
        .post(tripControllerUrl)
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("description", equalTo("trip to sofia"))
        .extract().jsonPath().getInt("id");

    TripConfigurationDTO tripConfigurationDTO = new TripConfigurationDTO();
    tripConfigurationDTO.setMetric(Metric.Temperature);
    tripConfigurationDTO.setMin(12.0);
    tripConfigurationDTO.setMax(14.5);

    RestAssured
        .given()
        .body(tripConfigurationDTO)
        .contentType(ContentType.JSON)
        .when()
        .post(tripControllerUrl + "/" + tripId + "/configurations")
        .then()
        .statusCode(HttpStatus.OK.value())
        .body( "metric", equalTo(Metric.Temperature.toString()));
  }
}
