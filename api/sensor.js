// api/sensor.js - Handles sensor data only
let latestSensorData = {
  temperature: 0,
  humidity: 0,
  soil_moisture: 0,
  water_level: 0,
  timestamp: Date.now(),
  picoOnline: "False"

};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  console.log(`Sensor API: ${req.method} request`);
  let lastSeen = 0;   // track Pico W last request
let picoOnline = "False";

// Timer to check if Pico is alive
setInterval(() => {
  const now = Date.now();
  if (lastSeen && (now - lastSeen) > 120000) { // 2 minutes
    picoOnline = "False";
    latestSensorData.picoOnline=false;
    console.log("Pico W seems offline (no request in last 2 min)");
  } else if (lastSeen) {
    picoOnline ="True";
  }
}, 30000);
  
  if (req.method === "POST") {
    // Pico W sends sensor data here
    try {
      const sensorData = req.body;
      const now = Date.now();
      lastSeen = now;        // update heartbeat
      latestSensorData.picoOnline="True";
      
      // Validate sensor data
      if (typeof sensorData.temperature === 'number' && 
          typeof sensorData.humidity === 'number' && 
          typeof sensorData.soil_moisture === 'number' && 
          typeof sensorData.water_level === 'number' &&
          typeof sensorData.picoOnline === 'string') {
        
        latestSensorData = {
          ...sensorData,
          timestamp: Date.now()
        };
        
        console.log('Sensor data updated:', latestSensorData);
        res.status(200).json({ 
          success: true, 
          message: "Sensor data received",
          timestamp: latestSensorData.timestamp
        });
      } else {
        throw new Error('Invalid sensor data format');
      }
    } catch (error) {
      console.error('Error processing sensor data:', error);
      res.status(400).json({ 
        success: false, 
        error: "Invalid sensor data format" 
      });
    }
  } 
  else if (req.method === "GET") {
    // Web dashboard requests sensor data here
    try {
      res.status(200).json({
        ...latestSensorData,
        data_age_seconds: Math.floor((Date.now() - latestSensorData.timestamp) / 1000)
      });
    } catch (error) {
      console.error('Error sending sensor data:', error);
      res.status(500).json({ 
        error: "Failed to retrieve sensor data" 
      });
    }
  }
  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
