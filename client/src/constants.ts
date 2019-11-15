let httpAgen = require('https-agent').default;

export const API_URL = 'https://10.10.2.99:5000';
export const AXIOS_CONFIG = {

   baseURL: API_URL,
   headers: { 'Access-Control-Allow-Origin': '*' },
   
}