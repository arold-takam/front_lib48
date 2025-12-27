const CONFIG = {
    API_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080/api'
        : 'https://lib48.onrender.com/api'
};

Object.freeze(CONFIG);

// NB: This render URL is temporary.