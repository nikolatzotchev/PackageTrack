package com.begin.exeptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.EXPECTATION_FAILED)
public class EmailUsedException extends Exception {

  public EmailUsedException(String message) {
    super(message);
  }
}
