// env.js - Environment configuration for Space Invaders

const SpaceInvadersEnv = {
    // Site information
    SITE_NAME: "Space Invaders",
    SITE_DESCRIPTION: "Classic arcade game reimagined for modern browsers",
    SITE_URL: "https://spaceinvaderplus.onrender.com",
    SITE_AUTHOR: "Tahir Mohammed",
    
    // Game configuration
    DEFAULT_DIFFICULTY: "medium",
    ENABLE_SOUND: true,
    ENABLE_FULLSCREEN: true,
    ENABLE_HIGH_SCORES: true,
    
    // API endpoints (if needed in the future)
    API_URL: "https://api.spaceinvaderplus.onrender.com",
    
    // Social media links
    SOCIAL_FACEBOOK: "https://web.facebook.com/profile.php?id=61578530544135",
    SOCIAL_GITHUB: "https://github.com/tahir145",
    
    // Analytics (placeholder for future implementation)
    ANALYTICS_ID: "",
    
    // Feature flags
    FEATURES: {
        WELCOME_SCREEN: true,
        MOBILE_RESTRICTION: true,
        POWER_UPS: true,
        BARRIERS: true,
        WAVE_PROGRESSION: true
    },
    
    // Page paths
    PAGES: {
        HOME: "/",
        ABOUT: "/about.html",
        CONTACT: "/contact.html",
        NOT_FOUND: "/404.html"
    },
    
    // Get environment variable with fallback
    get: function(key, fallback = null) {
        return this[key] !== undefined ? this[key] : fallback;
    },
    
    // Check if a feature is enabled
    isFeatureEnabled: function(featureName) {
        return this.FEATURES[featureName] === true;
    }
};

// Freeze the object to prevent modifications
Object.freeze(SpaceInvadersEnv);
