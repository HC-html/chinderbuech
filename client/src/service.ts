import { configure } from 'axios-hooks'
import Axios from 'axios';

const axios = Axios.create({
   baseURL: 'http://10.10.2.99:5000/',
   headers: { 'Access-Control-Allow-Origin': '*' }
})
export function setup() {
   configure({ axios });
}
