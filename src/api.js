import axios from 'axios';

// This points directly to your FastAPI server
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const ReimburseAPI = {
    // 1. Auth & Users
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    getCompanyUsers: (adminId) => api.get(`/users/company/${adminId}`),

    // 2. Expenses
    submitExpense: (userId, data) => api.post(`/expenses/submit?user_id=${userId}`, data),
    getMyExpenses: (userId) => api.get(`/expenses/my-expenses/${userId}`),

    // 3. Approvals
    getPendingApprovals: (managerId) => api.get(`/approvals/pending/${managerId}`),
    processApproval: (expenseId, data) => api.post(`/approvals/${expenseId}/action`, data),

    // 4. ML & AI
    parseReceipt: (formData) => api.post('/ml/ocr-receipt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    chat: (data) => api.post('/ml/chat', data)
};

export default api;
