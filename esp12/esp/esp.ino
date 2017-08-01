#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <DHT.h>

int Sensor = 2 ;

DHT dht(Sensor, DHT11);

void setup() {
  Serial.begin(115200);    
  dht.begin();                         
  WiFi.begin("Linksys06235", "mtx11e8ecv");    
  while (WiFi.status() != WL_CONNECTED) {
 
    delay(500);
    Serial.println("Waiting for connection");
 
  }
   Serial.println("connected");
}

void loop() {
  // put your main code here, to run repeatedly:
   if (WiFi.status() == WL_CONNECTED) { 
    StaticJsonBuffer<300> JSONbuffer;   
    JsonObject& JSONencoder = JSONbuffer.createObject(); 
    double h = dht.readHumidity();
    double t = dht.readTemperature();
    //float hic = dht.computeHeatIndex(t, h, false);
    JSONencoder["temp"] = t;
    JSONencoder["humid"] = h;
    HTTPClient http;
    http.begin("http://192.168.1.107:8080/data/sensors");
    char JSONmessageBuffer[300];
    JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    http.addHeader("Content-Type", "application/json");
    http.POST(JSONmessageBuffer);
    String payload = http.getString();
    Serial.println(JSONmessageBuffer);
    Serial.println(payload);    
    http.end(); 
   }
   delay(10000); 
}
