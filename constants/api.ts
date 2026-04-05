
//이거에서 변경
export const API_BASE_URL = 'https://d0c2-118-34-229-88.ngrok-free.app';
// axios 기본 헤더에 추가
import axios from 'axios';
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';