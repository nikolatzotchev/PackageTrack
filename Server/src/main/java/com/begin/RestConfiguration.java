package com.begin;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.ISO8601DateFormat;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RestConfiguration {

  @Bean
  public Jackson2ObjectMapperBuilderCustomizer dateSerializationCustomized() {
    return (builder) -> builder
        .dateFormat(new ISO8601DateFormat())
        .featuresToDisable(
            SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
  }
}
