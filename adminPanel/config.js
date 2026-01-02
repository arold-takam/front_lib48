export const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080/api'
    : 'https://lib48backend.onrender.com/api'; // Ton URL Render réelle


console.log(`🚀 API branchée sur : ${API_BASE_URL}`);