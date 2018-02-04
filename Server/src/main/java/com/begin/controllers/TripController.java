package com.begin.controllers;

import com.begin.ResourceNotFoundException;
import com.begin.services.TripService;
import io.swagger.annotations.ApiOperation;
import com.begin.dto.CreateTripDTO;
import com.begin.dto.TripConfigurationDTO;
import com.begin.entities.Report;
import com.begin.entities.Trip;
import com.begin.entities.TripConfiguration;
import java.util.List;
import javax.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/trips")
public class TripController {

  private final TripService tripService;

  public TripController(TripService tripService) {
    this.tripService = tripService;
  }

  @GetMapping(produces = "application/json")
  @ApiOperation(value = "Връща всички пътувания.",
      notes = "Съдържа параметър, който определя дали да се включат завършените, по подразбиране не ги.")
  public List<Trip> listTrips(
      @RequestParam(required = false, defaultValue = "false") boolean includeCompletedTrips) {
    return tripService.returnAllTrips(includeCompletedTrips);
  }

  @GetMapping(path = "/{tripId}", produces = "application/json")
  @ApiOperation(value = "Връща дадено пътуване.",
  notes = "Намира го по дадено id")
  public Trip getTrip(@PathVariable Long tripId) throws ResourceNotFoundException {
    return tripService.returnTrip(tripId);
  }

  @PostMapping(produces = "application/json")
  @ApiOperation(value = "Създаване на ново пътуване.")
  public Trip createTrip(@RequestBody @Valid CreateTripDTO request) {
    return tripService.createTrip(request);
  }

  @Transactional
  @DeleteMapping(path="/{tripId}/deleteTrip")
  @ApiOperation(value = "Изтриване на дадено пътуване.",
  notes = "Заедно с пътуването се изтрива и конфигурацията му.")
  public void deleteTrip(@PathVariable Long tripId) throws ResourceNotFoundException {
    tripService.deleteTrip(tripId);
  }

  @PostMapping(path = "/{tripId}/startTrip", produces = "application/json")
  @ApiOperation(value = "Стартиране на дедено пътуване.",
      notes = "Прави се проверка дали устройството вече няма стартирано пътуване.")
  public Trip startTrip(@PathVariable Long tripId) throws ResourceNotFoundException {
    return tripService.startTrip(tripId);
  }

  @PostMapping(path = "/{tripId}/endTrip", produces = "application/json")
  @ApiOperation(value = "Приключване на дадено пътуване.")
  public Trip endTrip(@PathVariable Long tripId) throws ResourceNotFoundException {
    return tripService.endTrip(tripId);
  }

  @GetMapping(path = "/{tripId}/reports", produces = "application/json")
  @ApiOperation(value = "Връща всички отчети за дадено пътуване.")
  public List<Report> getReports(@PathVariable Long tripId) throws ResourceNotFoundException {
    return tripService.returnReports(tripId);
  }

  @GetMapping(path = "/{tripId}/configurations", produces = "application/json")
  @ApiOperation(value = "Връща конфигурацията на дедено пътуване.")
  public List<TripConfiguration> getConfiguration(@PathVariable Long tripId)
      throws ResourceNotFoundException {
    return tripService.returnConfiguration(tripId);
  }

  @PostMapping(path = "/{tripId}/configurations", produces = "application/json")
  @ApiOperation(value = "Създаване на нова конфигурация на дадено пътуване.")
  public TripConfiguration setConfiguration(@PathVariable Long tripId,
     @RequestBody TripConfigurationDTO tripConfigurationDTO) throws ResourceNotFoundException {
      return tripService.setConfiguration(tripId, tripConfigurationDTO);
  }

  @DeleteMapping(path = "/{tripId}/configurations")
  @ApiOperation(value = "Премахване на конфигурация на дадено пътуване.")
  public void deleteConfiguration(@PathVariable Long tripId){
    tripService.deleteConfiguration(tripId);
  }
}
