// api/sensor.js

let latestData = {
  temperature: 0,
  humidity: 0,
  soil_moisture: 0,
  water_level: 0
};

export default function handler(req, res) {
  if (req.method === "POST") {
    latestData = req.body;
    res.status(200).json({ message: "Data updated", data: latestData });
  } else if (req.method === "GET") {
    res.status(200).json(latestData);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
