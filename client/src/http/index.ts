import axios from 'axios';

export const API_URL = `https://fake-data-generator-server.vercel.app/api`

const $api = axios.create({
    baseURL: API_URL
})

export default $api;