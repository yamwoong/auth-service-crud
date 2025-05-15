import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키를 포함한 요청을 보낼 수 있게 설정
});

// 인터셉터를 사용하여 매 요청마다 Authorization 헤더에 token을 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // localStorage에서 토큰 가져오기
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `${token}`; // Bearer 토큰 형식으로 헤더에 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // 에러 처리
  }
);
