import { configure } from 'axios-hooks'
import Axios from 'axios';
import {API_URL} from './constants';

const axios = Axios.create({
   baseURL: API_URL,
   headers: { 'Access-Control-Allow-Origin': '*' }
})
export function setup() {
   configure({ axios });
}
