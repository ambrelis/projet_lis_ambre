module.exports =  {
    // Configuration JWT
    JWT_SECRET: process.env.JWT_SECRET || "EMMA123_SECRET_KEY_SECURE",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "EMMA123_REFRESH_SECRET_KEY",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    
    // Pour compatibilité (ancienne variable)
    ACCESS_TOKEN_SECRET: process.env.JWT_SECRET || "EMMA123_SECRET_KEY_SECURE",
    
    // Configuration Base de données
    BDD : {
        "host" :"dpg-d5ekvua4d50c73c5qilg-a.oregon-postgres.render.com",
        "port" : "5432",
        "user" : "pollution3_user",
        "password" : "w84SolW6jMpawJzmpkNLAIIFH7gibqjp",
        "bdname" :"pollution3" 
    },
    
    // Configuration Cloudinary (à configurer dans les variables d'environnement)
    CLOUDINARY: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
}

