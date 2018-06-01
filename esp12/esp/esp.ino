#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include "FS.h"

/*
//display -------------------------------------------------------------------
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define OLED_RESET LED_BUILTIN
Adafruit_SSD1306 display(OLED_RESET);
// ---------------------------------------------------------------------------
*/
// photoresistor pin
int lightPin = 0;


//device serial number
const char* serialNo = "0123a";
// gps 
static const int RXPin = 5, TXPin = 4;
static const uint32_t GPSBaud = 9600;
// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);
// dht pin 
int dhtSensorPin = 2 ;
//initialize dht sensor
DHT dht(dhtSensorPin, DHT11);

// not sure yet where the server will be hosted
String url = "api/v1/devices/reports";


void setup() {
  Serial.begin(9600);
  /*// ----------------------------------------------------------------------
   display.begin(SSD1306_SWITCHCAPVCC, 0x3C);  // initialize with the I2C addr 0x3D (for the 128x64)
  // init done
  display.display();
  delay(2000);

  // Clear the buffer.
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.print("No: ");
  display.println(serialNo);
  display.display();
  delay(1000); */
  // -------------------------------------------------
  // mounting the filesystem
  bool result = SPIFFS.begin();
  Serial.println("SPIFFS opened: " + result);
  // remove the file if it exists
  SPIFFS.remove("/reports.txt");
  ss.begin(GPSBaud);
  dht.begin();     
  delay(200);
  WiFi.persistent(false);
	WiFi.mode(WIFI_OFF);   // this is a temporary line, to be removed after SDK update to 1.5.4
	WiFi.mode(WIFI_STA);
  WiFi.begin("yourssid", "yourpass"); 
  while (WiFi.status() != WL_CONNECTED) {
	  Serial.println(WiFi.status());
      delay(500);
    Serial.println("Waiting for connection");
  }
   Serial.println("connected");
}

void loop() {
	 if (checkIfStartedTrip() == true) {
	  sendInfo();
	 // delay(100);
	  Serial.println(ESP.getFreeHeap());
	 }
	 delay(200);
	/*
  while (ss.available() > 0)
  if (gps.encode(ss.read())) { 
    if ( gps.date.isValid() && gps.time.isValid()) { 
      if (checkIfStartedTrip() == true)
      sendInfo();
    }
    delay(1000);
  }
  */
}

boolean checkIfStartedTrip() {
  char path[100] = "api/v1/devices/currentTrip/";
  strcat(path, serialNo);
  // Serial.println(path);
  HTTPClient http;
  http.begin(path);
  http.sendRequest("GET");
  String payload = http.getString();
  http.end();
  if (payload == "true") {
    return true;
  }
  return false;
}


void httpPost(JsonObject& json) {
  HTTPClient http;
  http.begin(url);
  char JSONmessageBuffer[750];
  json.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
  Serial.println(JSONmessageBuffer);
  delay(2000);
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
/*
void displayWifiStatus(char *wifiStatus) {
	  display.setTextSize(2);
	  Serial.println("------------------------");
	  
   for (int x = 0; x <= 14; x++) {
    for (int y = 0; y < 128;y++) {
      display.drawPixel(y,50+x, BLACK);
    }
      display.display();
  } 
  delay(500);
  display.setCursor(0, 50);
  display.println("wifi: ");
  display.print(wifiStatus);
  display.display();
  delay(500);
}
*/
void sendInfo() {
	while(true) {
  while (ss.available() > 0) {
		if (gps.encode(ss.read())) { 
			float temperature = dht.readTemperature();
			float humidity = dht.readHumidity();
			if (!isnan(temperature) && !isnan(humidity) && gps.date.isValid() 
				&& gps.time.isValid() && gps.location.isValid() && gps.location.isUpdated()) { 
			//if (gps.date.isValid() && gps.time.isValid() && gps.location.isValid() && gps.location.isUpdated()) { 
			 	StaticJsonBuffer<750> JSONbuffer;   
				JsonObject& root = JSONbuffer.createObject(); 
				JsonArray& values = root.createNestedArray("incidentValues");
				JsonObject& temp = values.createNestedObject();
				JsonObject& humd = values.createNestedObject();
				temp["metric"] = "Temperature";
				humd["metric"] = "Humidity";
				if (analogRead(lightPin) > 100) {
					JsonObject& opened = values.createNestedObject();
					opened["metric"] = "Opened";
					opened["value"] = 1;
				}
				temp["value"] = temperature;
				humd["value"] = humidity;
				root["serialNo"] = serialNo;
				root["latitude"] = gps.location.lat();
				root["longitude"] = gps.location.lng();
				char isoTime[100];
				strcpy(isoTime, getDateInIso8601());
				Serial.println(isoTime);
				root["timestamp"] = isoTime;
				// make the post request
				if (WiFi.status() == WL_CONNECTED) {
					// return when there is no trip
					if (checkIfStartedTrip() == false) {
						return;
					}
				//  displayWifiStatus("on");
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
				// displayWifiStatus("off"); 
				File file = SPIFFS.open("/reports.txt", "a");
				if (!file) {
				  Serial.println("file creation failed");
				}
					root.printTo(file);
				    file.println("");
				}
				delay(10000); 
			}
		}
		yield();
	}
	yield();
  }
}
