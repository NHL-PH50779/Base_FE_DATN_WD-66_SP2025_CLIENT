import type { Category, Brand, NewsItem } from "../types/product.type";

import axios from "axios";



const API_URL = "http://localhost:8000/api";



export const getAllLaptops = () => {

  return axios.get(`${API_URL}/products`);

};



export const searchLaptops = (keyword: string) => {

  return axios.get(`${API_URL}/products/search?keyword=${keyword}`);

};



export const getCategories = () => {

  return axios.get(`${API_URL}/categories`);

};



export const getBrands = () => {

  return axios.get(`${API_URL}/brands`);

};



export const getNews = () => {

  return axios.get(`${API_URL}/news`);

};