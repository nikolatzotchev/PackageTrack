package com.begin;

import com.begin.controllers.TripController;
import com.begin.entities.Trip;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.*;


import java.time.ZonedDateTime;

//@RunWith(SpringRunner.class)
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//public class TripControllerTest {
//
//    @Autowired
//    private TripController tripController;
//
//    @Test
//    public void exampleTest() {
//        Trip trip = tripController.createTrip("Trip to Sofia", Long.valueOf(2));
//        assertThat(trip.getDescription()).isEqualTo("Trip to Sofia");
//    }
//}
