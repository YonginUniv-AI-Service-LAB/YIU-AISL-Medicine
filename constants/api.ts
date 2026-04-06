import axios from 'axios';

// ⚠️ ngrok 주소 바뀌면 여기만 수정
// 각자 본인 ngrok URL로 변경 후 사용
export const API_BASE_URL = 'https://099d-220-66-64-196.ngrok-free.app';

axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';