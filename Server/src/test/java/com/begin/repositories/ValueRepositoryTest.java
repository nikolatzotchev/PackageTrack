package com.begin.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import com.begin.entities.Value;
import com.begin.entities.Value.Metric;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ValueRepositoryTest {

  @Autowired
  private ValueRepository valueRepository;

  @Test
  public void valueTest() {
    Value value = new Value();
    value.setMetric(Metric.Temperature);
    value.setValue(20.5);

    Value value2 = new Value();
    value2.setMetric(Metric.Humidity);

    assertThat(value.getMetric().getUnit()).isEqualTo("C");
    valueRepository.save(value);
    valueRepository.saveAndFlush(value2);
    assertThat(valueRepository.findAll().size()).isEqualTo(2);
  }
}
