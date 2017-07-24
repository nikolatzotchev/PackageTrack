package com.begin.Controllers;

import com.begin.Sensors.Temp;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/data")
public class GreetingController {

    @RequestMapping(method = RequestMethod.POST, path = "/temp")
    public void addTemp(@RequestBody Temp temp) {
        temp.displayTemp();
    }

}