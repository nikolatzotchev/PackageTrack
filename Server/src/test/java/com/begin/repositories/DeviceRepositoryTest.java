package com.begin.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import com.begin.entities.Device;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DeviceRepositoryTest {

  @Autowired
  private DeviceRepository deviceRepository;

  @Test
  public void deviceRepoTest() {
    Device device = new Device();
    device.setSerialNo("1234");
    deviceRepository.saveAndFlush(device);
    assertThat(deviceRepository.findOne(deviceRepository.saveAndFlush(device).getId()))
        .isNotEqualTo("4321");
  }
}
