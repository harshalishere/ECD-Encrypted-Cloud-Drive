import axios from 'axios';

// 1. Create the Axios Instance
const api = axios.create({
  baseURL: '', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor (Attaches Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';  // <--- UPDATED to /signin
    }
    return Promise.reject(error);
  }
);

// --- AUTH FUNCTIONS ---

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await api.post('/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

// --- FOLDER FUNCTIONS ---

export const fetchFolderContent = async (folderId = null) => {
  const response = await api.get('/folders/content', {
    params: { folder_id: folderId } 
  });
  return response.data;
};

export const createFolder = async (name, parentId = null) => {
  const response = await api.post('/folders/create', {
    name: name,
    parent_id: parentId
  });
  return response.data;
};

// --- FILE FUNCTIONS ---

export const fetchFiles = async () => {
  const response = await api.get('/files');
  return response.data;
};

export const fetchStorageStats = async () => {
  const response = await api.get('/files/stats');
  return response.data;
};

export const uploadFile = async (file, folderId = null) => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (folderId) {
    formData.append('folder_id', folderId);
  }

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', 
    },
  });
  return response.data;
};

export const deleteFile = async (fileId) => {
  await api.delete(`/files/${fileId}`);
};

export const downloadFile = async (fileId, filename) => {
  const response = await api.get(`/files/${fileId}/download`, {
    responseType: 'blob', 
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// --- SHARE FUNCTIONS ---

export const createShareLink = async (fileId, password = null, expiresMinutes = null) => {
  const response = await api.post('/share/create', {
    file_id: fileId,
    password: password,
    expires_minutes: expiresMinutes
  });
  return response.data;
};

export const getShareInfo = async (hash) => {
  const response = await api.get(`/share/${hash}/info`);
  return response.data;
};

export const downloadSharedFile = async (hash, password = "") => {
  const response = await api.post(`/share/${hash}/download`, 
    { password: password }, 
    { responseType: 'blob' }
  );
  return response; 
};

export default api;