// api/sensor.js - Handles sensor data only
let latestSensorData = {
  temperature: 25.0,
  humidity: 65.0,
  soil_moisture: 45.0,
  water_level: 75.0,
  timestamp: Date.now()
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
  
  if (req.method === "POST") {
    // Pico W sends sensor data here
    try {
      const sensorData = req.body;
      
      // Validate sensor data
      if (typeof sensorData.temperature === 'number' && 
          typeof sensorData.humidity === 'number' && 
          typeof sensorData.soil_moisture === 'number' && 
          typeof sensorData.water_level === 'number') {
        
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
