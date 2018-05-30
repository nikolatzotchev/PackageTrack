planeId=$1
deviceID=$2
while :
do

UTPUT="$(curl "https://www.flightradar24.com/v1/search/web/find?query=$planeId" | jq '.results | .[0] | .detail | .[]')"
if [ "$?" -ne 0 ]; then
    break
fi
planeCO=($(echo "$UTPUT" | sed 's/"//g'))
lat=$(echo ${planeCO[0]})
long=$(echo  ${planeCO[1]})

randomTemperature=0
randomHumidity=0
randomOpened=0

for i in `seq 1 10`; do
    let "randomTemperature += "$(shuf -i 0-55 -n 1)-10"|bc"
    let "randomHumidity += "$(shuf -i 0-100 -n 1)""
    let "randomOpened += "$(shuf -i 0-100 -n 1)""
done

let "randomTemperature=$(echo "$randomTemperature/10")"
let "randomHumidity=$(echo "$randomHumidity/10")"
let "randomOpened=$(echo "$randomOpened/10")"
localTime=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

incidentValuesList="{  
       \"metric\": \"Temperature\",  
       \"value\": $randomTemperature  
     }, 
     {  
       \"metric\": \"Humidity\",  
       \"value\": $randomHumidity  
     }"

if [ "$randomOpened" -lt 20 ]; then
    incidentValuesList="$incidentValuesList,{  
       \"metric\": \"Opened\",  
       \"value\": $randomTemperature  
     }"
fi
echo $incidentValuesList
POSTRQ="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d "{\"incidentValues\": [$incidentValuesList], 
   \"latitude\": $lat,  
   \"longitude\": $long,  
   \"serialNo\": \"$deviceID\",  
   \"timestamp\": \"$localTime\" 
 }" 'http://localhost:8080/api/v1/devices/reports' | jq '.status?')"
sleep 90
done
