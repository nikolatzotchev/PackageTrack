package com.begin.Services;

import com.begin.Sensors.Temp;
import com.begin.Sensors.TempRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

public class TempService {
    @Autowired
    private TempRepository tmprepo;

    public void addTemp(Temp tmp){
        tmprepo.save(new Temp(tmp.getTemp()));
    }
}
