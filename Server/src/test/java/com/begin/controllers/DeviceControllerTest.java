package com.begin.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.lessThan;
import static org.hamcrest.Matchers.notNullValue;

import com.begin.dto.CreateTripDTO;
import com.begin.dto.ReportDTO;
import com.begin.dto.TripConfigurationDTO;
import com.begin.entities.Value;
import com.begin.entities.Value.Metric;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import java.time.ZonedDateTime;
import java.util.LinkedList;
import java.util.List;
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

  private static final String deviceControllerUrl = "/api/v1/devices";
  private static final String tripControllerUrl = "/api/v1/trips";
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
        .post(deviceControllerUrl)
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("serialNo", equalTo("aa-bb-cc-dd"))
        .extract().path("id");

    RestAssured
        .when()
        .get(deviceControllerUrl)
        .then()
        .body("serialNo", hasItem("aa-bb-cc-dd"))
        .body("id", hasItem(deviceId));
  }


  @Test
  public void register_device_without_SerialNo_should_Pass() {
   RestAssured
        .when()
        .post(deviceControllerUrl)
        .then()
        .statusCode(HttpStatus.OK.value());

    RestAssured
        .when()
        .get(deviceControllerUrl)
        .then()
        .statusCode(HttpStatus.OK.value());
  }

  @Test
  public void allTrips_with_InexistentDevice_should_404() {
    RestAssured
        .when()
        .get(deviceControllerUrl + "/123456789/trips")
        .then()
        .statusCode(HttpStatus.NOT_FOUND.value());

    int deviceId = RestAssured
        .when()
        .post(deviceControllerUrl)
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("id", notNullValue())
        .extract()
        .body().jsonPath().getInt("id");

    RestAssured
        .when()
        .get(deviceControllerUrl + "/" + deviceId + "/trips")
        .then()
        .statusCode(HttpStatus.OK.value());

    RestAssured
        .when()
        .get(deviceControllerUrl + deviceId + "/lastTrip")
        .then()
        .statusCode(HttpStatus.NOT_FOUND.value())
        .time(lessThan(2000L));
  }

  @Test
  public void addReport_should_404() {
    int deviceId = RestAssured
        .when()
        .post(deviceControllerUrl)
        .then()
        .statusCode(HttpStatus.OK.value())
        .extract().path("id");

    ReportDTO reportDTO = new ReportDTO();

    RestAssured
        .given()
        .body(reportDTO)
        .contentType(ContentType.JSON)
        .when()
        .post(deviceControllerUrl + deviceId + "/reports")
        .then()
        .statusCode(HttpStatus.NOT_FOUND.value());
  }

  @Test
  public void addReport_should_Pass() {
    //register device
    int deviceId = RestAssured
        .when()
        .post(deviceControllerUrl)
        .then()
        .statusCode(HttpStatus.OK.value())
        .extract().path("id");

    CreateTripDTO createTripDTO = new CreateTripDTO();
    createTripDTO.setDeviceId((long) deviceId);
    createTripDTO.setDescription("trip to sofia");

    //create trip
    int tripId = RestAssured
        .given()
        .body(createTripDTO)
        .contentType(ContentType.JSON)
        .when()
        .post(tripControllerUrl)
        .then()
        .extract().jsonPath().getInt("id");

    TripConfigurationDTO tripConfigurationDTO = new TripConfigurationDTO();
    tripConfigurationDTO.setMetric(Metric.Temperature);
    tripConfigurationDTO.setMax(30d);
    tripConfigurationDTO.setMin(10d);

    RestAssured
        .given()
        .body(tripConfigurationDTO)
        .contentType(ContentType.JSON)
        .when()
        .post(tripControllerUrl + "/" + tripId + "/configurations")
        .then()
        .statusCode(HttpStatus.OK.value());

    //start trip
    RestAssured
        .when()
        .post(tripControllerUrl + "/" + tripId + "/startTrip")
        .then()
        .statusCode(HttpStatus.OK.value());

    ReportDTO reportDTO = new ReportDTO();
    Value value = new Value();
    value.setMetric(Metric.Temperature);
    value.setValue(31d);
    List<Value> list = new LinkedList<>();
    list.add(value);
    reportDTO.setIncidentValues(list);
    reportDTO.setTimestamp(ZonedDateTime.now());

    //post report and check if report is accepted
    RestAssured
        .given()
        .body(reportDTO)
        .contentType(ContentType.JSON)
        .when()
        .post(deviceControllerUrl + "/" + deviceId + "/reports")
        .then()
        .statusCode(HttpStatus.OK.value())
        .body("incidentValues.get(0).metric", equalTo(Metric.Temperature.toString()));
  }
}
