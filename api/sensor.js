// api/sensor.js - Fixed version with better pump command handling
let latestData = {
  temperature: 0,
  humidity: 0,
  soil_moisture: 0,
  water_level: 0
};

let pumpCommand = {
  command: "none", // "on", "off", "none"
  timestamp: Date.now()
};

export default function handler(req, res) {
  // Enable CORS for web requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  // Log all requests for debugging
  console.log(`${req.method} ${req.url}`, req.body || '');
  
  if (req.method === "POST") {
    // Handle sensor data from Pico W
    try {
      latestData = req.body;
      console.log('Sensor data updated:', latestData);
      res.status(200).json({ message: "Sensor data updated", data: latestData });
    } catch (error) {
      console.error('Error updating sensor data:', error);
      res.status(500).json({ error: "Failed to update sensor data" });
    }
  } 
  else if (req.method === "GET") {
    // Handle different GET requests
    if (req.url.includes("/pump")) {
      // Pico W requesting pump commands
      console.log('Pico W requesting pump command:', pumpCommand);
      
      const response = {
        command: pumpCommand.command,
        timestamp: pumpCommand.timestamp
      };
      
      // Reset command to 'none' after 30 seconds to prevent stuck commands
      const now = Date.now();
      if (pumpCommand.command !== "none" && (now - pumpCommand.timestamp) > 30000) {
        console.log('Clearing old pump command');
        pumpCommand.command = "none";
      }
      
      res.status(200).json(response);
    } else {
      // Web dashboard requesting sensor data
      res.status(200).json({
        ...latestData,
        pump_status: pumpCommand.command,
        last_command: pumpCommand.timestamp
      });
    }
  }
  else if (req.method === "PUT") {
    // Handle pump control commands from web dashboard
    if (req.url.includes("/pump")) {
      try {
        const { command } = req.body;
        
        if (["on", "off"].includes(command)) {
          pumpCommand = {
            command: command,
            timestamp: Date.now()
          };
          
          console.log('New pump command received:', pumpCommand);
          
          res.status(200).json({ 
            message: `Pump command '${command}' sent`, 
            command: pumpCommand.command,
            timestamp: pumpCommand.timestamp
          });
        } else {
          res.status(400).json({ error: "Invalid pump command. Use 'on' or 'off'" });
        }
      } catch (error) {
        console.error('Error processing pump command:', error);
        res.status(500).json({ error: "Failed to process pump command" });
      }
    } else {
      res.status(404).json({ error: "Endpoint not found" });
    }
  }
  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
