import axios from 'axios';

// Get API base URL from environment variables, fallback to port 5000 locally
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export const uploadResumeFile = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        }
      }
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || 'Failed to upload and parse resume.';
    throw new Error(errorMsg);
  }
};

export const analyzeResumeDetails = async (resumeText, targetRole) => {
  try {
    const response = await apiClient.post('/analyze-resume', {
      text: resumeText,
      role: targetRole
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || 'Analysis service failed. Please try again.';
    throw new Error(errorMsg);
  }
};

export const getInterviewQuestions = async (resumeText, targetRole) => {
  try {
    const response = await apiClient.post('/generate-interview-questions', {
      text: resumeText,
      role: targetRole
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || 'Question generator failed. Please try again.';
    throw new Error(errorMsg);
  }
};

export default apiClient;
