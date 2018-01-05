import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-togo.firebaseio.com/'
})

export default instance
