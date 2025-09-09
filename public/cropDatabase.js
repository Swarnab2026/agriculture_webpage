// Crop data is now loaded from external cropDatabase.js file
// Crop Database for AgroSmart Irrigation System
// Contains crop-specific information for farmers in Jorethang, South Sikkim

const cropDatabase = {
    rice: {
        optimalMoisture: 65,
        growthStage: "Flowering",
        waterFrequency: "Daily",
        season: "Kharif",
        temperature: 25,
        humidity: 85
    },
    wheat: {
        optimalMoisture: 60,
        growthStage: "Grain filling",
        waterFrequency: "Every 2-3 days",
        season: "Rabi",
        temperature: 20,
        humidity: 60
    },
    maize: {
        optimalMoisture:60,
        growthStage: "Vegetative",
        waterFrequency: "Daily",
        season: "Kharif/Rabi",
        temperature: 25,
        humidity: 70
    },
    tomato: {
        optimalMoisture: 70,
        growthStage: "Fruit development",
        waterFrequency: "Daily",
        season: "Year-round",
        temperature: 25,
        humidity: 65
    },
    potato: {
        optimalMoisture: 75,
        growthStage: "Tuber formation",
        waterFrequency: "Every 2 days",
        season: "Rabi",
        temperature: 18,
        humidity: 75
    },
    cabbage: {
        optimalMoisture: 75,
        growthStage: "Head formation",
        waterFrequency: "Daily",
        season: "Winter",
        temperature: 20,
        humidity: 70
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
