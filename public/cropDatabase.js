// Crop data is now loaded from external cropDatabase.js file
// Crop Database for AgroSmart Irrigation System
// Contains crop-specific information for farmers in Jorethang, South Sikkim

const cropDatabase = {
    rice: {
        optimalMoisture: 65,
        growthStage: "Flowering",
        waterFrequency: "Daily",
        season: "Kharif",
        temperature: "20-35°C",
        humidity: "80-90%"
    },
    wheat: {
        optimalMoisture: "50-65%",
        growthStage: "Grain filling",
        waterFrequency: "Every 2-3 days",
        season: "Rabi",
        temperature: "15-25°C",
        humidity: "50-70%"
    },
    maize: {
        optimalMoisture: "55-70%",
        growthStage: "Vegetative",
        waterFrequency: "Daily",
        season: "Kharif/Rabi",
        temperature: "18-30°C",
        humidity: "60-80%"
    },
    tomato: {
        optimalMoisture: "65-75%",
        growthStage: "Fruit development",
        waterFrequency: "Daily",
        season: "Year-round",
        temperature: "20-30°C",
        humidity: "60-70%"
    },
    potato: {
        optimalMoisture: "55-65%",
        growthStage: "Tuber formation",
        waterFrequency: "Every 2 days",
        season: "Rabi",
        temperature: "15-20°C",
        humidity: "70-80%"
    },
    cabbage: {
        optimalMoisture: "70-80%",
        growthStage: "Head formation",
        waterFrequency: "Daily",
        season: "Winter",
        temperature: "15-25°C",
        humidity: "60-75%"
    }
};

// Export the database for use in other files
// This supports both CommonJS (Node.js) and ES6 module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cropDatabase;
}

// For browser environments, make it globally available
if (typeof window !== 'undefined') {
    window.cropDatabase = cropDatabase;
}
