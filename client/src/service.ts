import { configure } from 'axios-hooks'
import Axios from 'axios';
import {AXIOS_CONFIG} from './constants';

const axios = Axios.create(AXIOS_CONFIG)
export function setup() {
   configure({ axios });
}
