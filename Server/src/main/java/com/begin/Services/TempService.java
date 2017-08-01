package com.begin.services;

import com.begin.sensors.Temp;
import com.begin.sensors.TempRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class TempService {
    @Autowired
    private TempRepository tmprepo;

    public void addTemp(Temp tmp){
        tmprepo.save(tmp);
    }
}
