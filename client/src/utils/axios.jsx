import axios from "axios";
// const baseURL = process.env.REACT_APP_LARAVEL_API;
/**
 * NOTE:
 * I always use .env file, but for simplicity I did not use .env file for this project
 */
export const baseURL = "https://pmisndc.gov.af/erfan_websites/laravel_api/";
// export const baseURL = "http://127.0.0.1:8000/";
export const axiosInstanceWithJsonType = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  }
});


export const axiosInstanceWithMultipart = axios.create({
  baseURL,
  headers: {
    "Content-Type": "multipart/form-date",
  }
});

