const BASE_URL = '/api';

export const api = {
  // Public Content
  async getContent() {
    const res = await fetch(`${BASE_URL}/content`);
    if (!res.ok) throw new Error('Failed to fetch website content');
    return res.json();
  },

  // Submit RFQ Quote Request
  async submitInquiry(data) {
    const res = await fetch(`${BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to submit quote request');
    return result;
  },

  // Health / DB Status
  async getHealth() {
    const res = await fetch(`${BASE_URL}/health`);
    return res.json();
  },

  // --- Admin API with Token Helper ---
  authHeaders() {
    const token = localStorage.getItem('srisakthi_admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  },

  async adminLogin(username, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Invalid admin credentials');
    return result;
  },

  async getAdminProfile() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: this.authHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch admin profile');
    return res.json();
  },

  // Update Company Settings (Name, Logo, Address, GST, etc.)
  async updateCompany(data) {
    const res = await fetch(`${BASE_URL}/content/company`, {
      method: 'PUT',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update company settings');
    return result;
  },

  // Update Hero Section
  async updateHero(data) {
    const res = await fetch(`${BASE_URL}/content/hero`, {
      method: 'PUT',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update hero section');
    return result;
  },

  // Update About Section
  async updateAbout(data) {
    const res = await fetch(`${BASE_URL}/content/about`, {
      method: 'PUT',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update about section');
    return result;
  },

  // Upload Image File (Logo, machinery, products)
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('srisakthi_admin_token');

    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formData
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Upload failed');
    return result;
  },

  // Services CRUD
  async getServices() {
    const res = await fetch(`${BASE_URL}/content/services`);
    return res.json();
  },

  async createService(data) {
    const res = await fetch(`${BASE_URL}/content/services`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateService(id, data) {
    const res = await fetch(`${BASE_URL}/content/services/${id}`, {
      method: 'PUT',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteService(id) {
    const res = await fetch(`${BASE_URL}/content/services/${id}`, {
      method: 'DELETE',
      headers: this.authHeaders()
    });
    return res.json();
  },

  // Machinery CRUD
  async getMachinery() {
    const res = await fetch(`${BASE_URL}/content/machinery`);
    return res.json();
  },

  async createMachine(data) {
    const res = await fetch(`${BASE_URL}/content/machinery`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateMachine(id, data) {
    const res = await fetch(`${BASE_URL}/content/machinery/${id}`, {
      method: 'PUT',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteMachine(id) {
    const res = await fetch(`${BASE_URL}/content/machinery/${id}`, {
      method: 'DELETE',
      headers: this.authHeaders()
    });
    return res.json();
  },

  // Inquiries / Leads CRM
  async getInquiries(params = {}) {
    const queryStr = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/inquiries?${queryStr}`, {
      headers: this.authHeaders()
    });
    return res.json();
  },

  async updateInquiryStatus(id, status, admin_notes) {
    const res = await fetch(`${BASE_URL}/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: this.authHeaders(),
      body: JSON.stringify({ status, admin_notes })
    });
    return res.json();
  },

  async deleteInquiry(id) {
    const res = await fetch(`${BASE_URL}/inquiries/${id}`, {
      method: 'DELETE',
      headers: this.authHeaders()
    });
    return res.json();
  },

  // Billing & Invoicing
  async getNextInvoiceNumber() {
    const res = await fetch(`${BASE_URL}/billing/next-number`, {
      headers: this.authHeaders()
    });
    return res.json();
  },

  async getBillingCustomers() {
    const res = await fetch(`${BASE_URL}/billing/customers`, {
      headers: this.authHeaders()
    });
    return res.json();
  },

  async createBillingCustomer(data) {
    const res = await fetch(`${BASE_URL}/billing/customers`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getInvoices() {
    const res = await fetch(`${BASE_URL}/billing/invoices`, {
      headers: this.authHeaders()
    });
    return res.json();
  },

  async getInvoiceById(id) {
    const res = await fetch(`${BASE_URL}/billing/invoices/${id}`, {
      headers: this.authHeaders()
    });
    return res.json();
  },

  async createInvoice(data) {
    const res = await fetch(`${BASE_URL}/billing/invoices`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Invoice creation failed');
    return result;
  },

  async updateInvoiceStatus(id, payment_status, payment_mode) {
    const res = await fetch(`${BASE_URL}/billing/invoices/${id}/status`, {
      method: 'PATCH',
      headers: this.authHeaders(),
      body: JSON.stringify({ payment_status, payment_mode })
    });
    return res.json();
  },

  async deleteInvoice(id) {
    const res = await fetch(`${BASE_URL}/billing/invoices/${id}`, {
      method: 'DELETE',
      headers: this.authHeaders()
    });
    return res.json();
  }
};

