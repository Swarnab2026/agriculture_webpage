// api/sensor.js - Handles sensor data only

// Global variables (persistent across requests)
let latestSensorData = {
  temperature: 0,
  humidity: 0,
  soil_moisture: 0,
  water_level: 0,
  timestamp: Date.now(),
  picoOnline: "False"
};

let lastSeen = 0;   // track Pico W last request
let picoOnline = "False";
let timerInitialized = false; // Prevent multiple timers

// Initialize timer only once
function initializeTimer() {
  if (!timerInitialized) {
    timerInitialized = true;
    
    // Timer to check if Pico is alive - runs every 30 seconds
    setInterval(() => {
      const now = Date.now();
      
      if (lastSeen && (now - lastSeen) > 120000) { // 2 minutes
        if (picoOnline === "True") {
          picoOnline = "False";
          latestSensorData.picoOnline = "False";
          console.log("Pico W went offline (no request in last 2 min)");
        }
      } else if (lastSeen && picoOnline === "False") {
        // Pico came back online
        picoOnline = "True";
        latestSensorData.picoOnline = "True";
        console.log("Pico W is back online");
      }
    }, 30000); // Check every 30 seconds
    
    console.log("Pico W monitoring timer initialized");
  }
}

export default function handler(req, res) {
  // Initialize timer on first request
  initializeTimer();
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  console.log(`Sensor API: ${req.method} request`);
  
  if (req.method === "POST") {
    // Pico W sends sensor data here
    try {
      const sensorData = req.body;
      const now = Date.now();
      lastSeen = now;        // update heartbeat
      
      // Mark Pico as online when it sends data
      picoOnline = "True";
      
      // Validate sensor data
      if (typeof sensorData.temperature === 'number' && 
          typeof sensorData.humidity === 'number' && 
          typeof sensorData.soil_moisture === 'number' && 
          typeof sensorData.water_level === 'number') {
        
        latestSensorData = {
          ...sensorData,
          timestamp: now,
          picoOnline: "True" // Always true when receiving data
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
      const dataAge = Math.floor((Date.now() - latestSensorData.timestamp) / 1000);
      
      // Additional check: if data is too old, mark as offline
      if (dataAge > 120) { // 2 minutes
        latestSensorData.picoOnline = "False";
      }
      
      res.status(200).json({
        ...latestSensorData,
        data_age_seconds: dataAge
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
