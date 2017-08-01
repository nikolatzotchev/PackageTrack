package com.begin.sensors;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TempRepository extends CrudRepository<Temp, Long> {

}
