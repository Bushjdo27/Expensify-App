/**
 * 
 * Config file
 * 
 */


 const enviroments = {};


 enviroments.staging = {
     httpPort: 3000,
     httpsPort: 3001,
     envName: "staging",
     secretKey: "ThisIsSecretKeyForStagingByBushjdo"
 }


 enviroments.production = {
     httpPort: 5000,
     httpsPort: 5001,
     envName: "production",
     secretKey: "ThisIsSecretKeyForProductionByBushjdo"
 }


 const currentEnviroments = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : "staging";
 const enviromentToExport = typeof(enviroments[currentEnviroments]) === 'object' ? enviroments[currentEnviroments] : enviroments.staging;


 module.exports = enviromentToExport