// api/sensor.js
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
  
  if (req.method === "POST") {
    // Handle sensor data from Pico W
    latestData = req.body;
    res.status(200).json({ message: "Sensor data updated", data: latestData });
  } 
  else if (req.method === "GET") {
    // Handle different GET requests
    if (req.url.includes("/pump")) {
      // Pico W requesting pump commands
      const response = {
        command: pumpCommand.command,
        timestamp: pumpCommand.timestamp
      };
      
      // Clear command after Pico reads it
      if (pumpCommand.command !== "none") {
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
      const { command } = req.body;
      
      if (["on", "off"].includes(command)) {
        pumpCommand = {
          command: command,
          timestamp: Date.now()
        };
        
        res.status(200).json({ 
          message: `Pump command '${command}' sent`, 
          command: pumpCommand.command,
          timestamp: pumpCommand.timestamp
        });
      } else {
        res.status(400).json({ error: "Invalid pump command. Use 'on' or 'off'" });
      }
    } else {
      res.status(404).json({ error: "Endpoint not found" });
    }
  }
  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
