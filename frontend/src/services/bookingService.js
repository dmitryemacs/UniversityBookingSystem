import api from './api';

export const bookingService = {
  getAll: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  cancel: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  updateStatus: async (bookingId, status, rejectionReason) => {
    const response = await api.put(`/bookings/${bookingId}/status`, {
      status,
      rejectionReason,
    });
    return response.data;
  },

  getEquipmentBookings: async (equipmentId) => {
    const response = await api.get(`/bookings/equipment/${equipmentId}`);
    return response.data;
  },
};
