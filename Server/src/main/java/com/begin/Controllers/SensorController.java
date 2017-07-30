package com.begin.Controllers;

import com.begin.Sensors.Temp;
import com.begin.Services.TempService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/data")
public class SensorController {

    private TempService tempService;

    @RequestMapping(method = RequestMethod.POST, path = "/temp")
    public void addTemp(@RequestBody Temp temp) {
        this.tempService.addTemp(temp);
        temp.displayTemp();
    }

}