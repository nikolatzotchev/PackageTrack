#!/bin/sh

echo "create the device"
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d 'aa-bb-cc-dd-ee-ff' 'http://localhost:8080/api/devices'

echo
echo "create the trip"
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
   "description": "string",
   "deviceId": 1
 }' 'http://localhost:8080/api/trips'

echo
echo "add report to a trip"
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
   "incidentValues": [
     {
       "metric": "Temperature",
       "value": 0
     }
   ],
   "latitude": 0,
   "longitude": 0,
   "timestamp": "2017-10-04T15:45:23.613Z"
 }' 'http://localhost:8080/api/trips/1/reports'

echo
echo "starting the trip"
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' 'http://localhost:8080/api/trips/1/startTrip'

echo
echo "add report to a trip"
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
   "incidentValues": [
     {
       "metric": "Temperature",
       "value": 0
     }
   ],
   "latitude": 0,
   "longitude": 0,
   "timestamp": "2017-10-04T15:45:23.613Z"
 }' 'http://localhost:8080/api/trips/1/reports'

echo
echo "obtain trip reports"
curl -X GET --header 'Accept: */*' 'http://localhost:8080/api/trips/1/reports'
