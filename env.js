
const SpaceInvadersEnv = {
  
    SITE_NAME: "Space Invaders",
    SITE_DESCRIPTION: "Classic arcade game reimagined for modern browsers",
    SITE_URL: "https://spaceinvaderplus.onrender.com",
    SITE_AUTHOR: "Tahir Mohammed",
    
    DEFAULT_DIFFICULTY: "medium",
    ENABLE_SOUND: true,
    ENABLE_FULLSCREEN: true,
    ENABLE_HIGH_SCORES: true,
    
    API_URL: "https://api.spaceinvaderplus.onrender.com",
    
    SOCIAL_FACEBOOK: "https://web.facebook.com/profile.php?id=61578530544135",
    SOCIAL_GITHUB: "https://github.com/tahir145",
    
    ANALYTICS_ID: "",
   
    FEATURES: {
        WELCOME_SCREEN: true,
        MOBILE_RESTRICTION: true,
        POWER_UPS: true,
        BARRIERS: true,
        WAVE_PROGRESSION: true
    },
    
    PAGES: {
        HOME: "/",
        ABOUT: "/about.html",
        CONTACT: "/contact.html",
        NOT_FOUND: "/404.html"
    },
    
 
    get: function(key, fallback = null) {
        return this[key] !== undefined ? this[key] : fallback;
    },
    
   
    isFeatureEnabled: function(featureName) {
        return this.FEATURES[featureName] === true;
    }
};
Object.freeze(SpaceInvadersEnv);
