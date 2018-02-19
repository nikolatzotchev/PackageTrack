#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include "FS.h"

//device serial number
const char* serialNo = "0123a";
// gps 
static const int RXPin = 5, TXPin = 4;
static const uint32_t GPSBaud = 9600;
// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

int Sensor = 2 ;

DHT dht(Sensor, DHT11);

// not sure yet where the server will be hosted
String url = "/api/v1/devices/reports";

StaticJsonBuffer<500> JSONbuffer;   
JsonObject& root = JSONbuffer.createObject(); 
JsonArray& values = root.createNestedArray("incidentValues");
JsonObject& temp = values.createNestedObject();
JsonObject& humd = values.createNestedObject();
 
void setup() {
  Serial.begin(9600);
  // mounting the filesystem
  bool result = SPIFFS.begin();
  Serial.println("SPIFFS opened: " + result);
  SPIFFS.remove("/reports.txt");
  ss.begin(GPSBaud);
  temp["metric"] = "Temperature";
  humd["metric"] = "Humidity";
  dht.begin();                         
  WiFi.begin("your ssid", "pass");    
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Waiting for connection");
  }
   Serial.println("connected");
}

void loop() {
	while (ss.available() > 0)
	if (gps.encode(ss.read())) { 
		if ( gps.date.isValid() && gps.time.isValid()) { 
			if (checkIfStartedTrip() == true)
			sendInfo();
		}
	}
}

boolean checkIfStartedTrip() {
	char path[50] = "/api/v1/devices/currentTrip/";
	strncpy(path, serialNo, 6);
	HTTPClient http;
	http.begin(path);
	http.sendRequest("GET");
	String payload = http.getString();
	Serial.println(payload);    
	delay(1000);
}


void httpPost(JsonObject& json) {
  HTTPClient http;
  http.begin(url);
  char JSONmessageBuffer[300];
  json.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
  Serial.println(JSONmessageBuffer);
  http.addHeader("Content-Type", "application/json");
  http.POST(JSONmessageBuffer);
  String payload = http.getString();
  Serial.println(payload);    
  http.end(); 
}

char* getDateInIso8601() {
  char isoTime[100];
  char year[5];
  itoa(gps.date.year(), year, 10);
  char month[3];
  itoa(gps.date.month(), month, 10);
  char day[3];
  itoa(gps.date.day(), day, 10);
  char hour[3];
  itoa(gps.time.hour(), hour, 10);
  char minute[3];
  itoa(gps.time.minute(), minute, 10);
  char second[3];
  itoa(gps.time.second(), second, 10);

  strncpy(isoTime, year, 5);
  strcat(isoTime, "-");
  if (atoi(month) < 10) {
    strcat(isoTime, "0");
  } 
  strcat(isoTime, month);
  strcat(isoTime, "-");
  if (atoi(day) < 10) {
    strcat(isoTime, "0");
  }
  strcat(isoTime, day);
  strcat(isoTime, "T");
  if (atoi(hour) < 10) {
    strcat(isoTime, "0");
  }
  strcat(isoTime, hour);
  strcat(isoTime, ":");
  if (atoi(minute) < 10) {
    strcat(isoTime, "0");
  }
  strcat(isoTime, minute);
  strcat(isoTime, ":");
  if (atoi(second) < 10) {
    strcat(isoTime, "0");
  }
  strcat(isoTime, second);
  strcat(isoTime, "Z");
  return isoTime;
}

void sendInfo() {
    double temperature = dht.readTemperature();
    double humidity = dht.readHumidity();
    temp["value"] = temperature;
    humd["value"] = humidity;
	root["serialNo"] = serialNo;
    root["latitude"] = gps.location.lat();
    root["longitude"] = gps.location.lng();
    char isoTime[100];
    strcpy(isoTime, getDateInIso8601());
    root["timestamp"] = isoTime;
    // make the post request
    if (WiFi.status() == WL_CONNECTED) {
    if(SPIFFS.exists("/reports.txt")) {
        File file = SPIFFS.open("/reports.txt", "r");
        if (file) {
          while(file.available()) {
      StaticJsonBuffer<500> JSONbufferForFile;   
            JsonObject& json =  JSONbufferForFile.parseObject(file.readStringUntil('\n'));
            httpPost(json);
          }
        }
      SPIFFS.remove("/reports.txt");
      }
      httpPost(root);
    } else {
     // save locally 
    File file = SPIFFS.open("/reports.txt", "a");
    if (!file) {
      Serial.println("file creation failed");
    }
        root.printTo(file);
    file.println("");
    }
    delay(1000); 
}


