// api/pump.js - Handles pump control commands only
let pumpState = {
  command: "none", // "on", "off", "none"
  timestamp: Date.now(),
  status: "OFF",
  last_action: null
};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  console.log(`Pump API: ${req.method} request`);
  
  if (req.method === "GET") {
    // Pico W requests pump commands here
    try {
      console.log('Pico W requesting pump command:', pumpState);
      
      // Auto-clear old commands after 30 seconds to prevent stuck states
      const now = Date.now();
      if (pumpState.command !== "none" && (now - pumpState.timestamp) > 30000) {
        console.log('Auto-clearing old pump command');
        pumpState.command = "none";
      }
      
      const response = {
        command: pumpState.command,
        timestamp: pumpState.timestamp,
        status: pumpState.status
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error sending pump command:', error);
      res.status(500).json({ 
        error: "Failed to retrieve pump command" 
      });
    }
  }
  else if (req.method === "PUT") {
    // Web dashboard sends pump control commands here
    try {
      const { command } = req.body;
      
      if (!["on", "off"].includes(command)) {
        return res.status(400).json({ 
          error: "Invalid command. Use 'on' or 'off'" 
        });
      }
      
      const now = Date.now();
      pumpState = {
        command: command,
        timestamp: now,
        status: command === "on" ? "ON" : "OFF",
        last_action: new Date(now).toISOString()
      };
      
      console.log('New pump command set:', pumpState);
      
      res.status(200).json({ 
        success: true,
        message: `Pump command '${command}' sent successfully`,
        command: pumpState.command,
        timestamp: pumpState.timestamp,
        status: pumpState.status
      });
      
    } catch (error) {
      console.error('Error processing pump command:', error);
      res.status(500).json({ 
        error: "Failed to process pump command" 
      });
    }
  }
  else if (req.method === "POST") {
    // Pico W can report pump status updates here (optional)
    try {
      const { status, action } = req.body;
      
      if (["ON", "OFF"].includes(status)) {
        pumpState.status = status;
        pumpState.last_action = new Date().toISOString();
        
        // Clear command after Pico confirms action
        if ((status === "ON" && pumpState.command === "on") || 
            (status === "OFF" && pumpState.command === "off")) {
          pumpState.command = "none";
        }
        
        console.log('Pump status updated by Pico:', pumpState);
        
        res.status(200).json({ 
          success: true,
          message: "Pump status updated",
          current_state: pumpState
        });
      } else {
        res.status(400).json({ 
          error: "Invalid status. Use 'ON' or 'OFF'" 
        });
      }
    } catch (error) {
      console.error('Error updating pump status:', error);
      res.status(500).json({ 
        error: "Failed to update pump status" 
      });
    }
  }
  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
