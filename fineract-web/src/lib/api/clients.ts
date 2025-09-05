import { apiClient } from './client';
import { 
  Client, 
  ClientSearchParams, 
  CreateClientRequest, 
  UpdateClientRequest, 
  ClientAccountsSummary 
} from '@/types/clients';

export class ClientsApi {
  /**
   * Retrieve all clients with optional search and pagination
   */
  static async getAllClients(params?: ClientSearchParams) {
    const response = await apiClient.get('/clients', {
      params: {
        sqlSearch: params?.search,
        offset: params?.offset || 0,
        limit: params?.limit || 200,
        orderBy: params?.orderBy || 'displayName',
        sortOrder: params?.sortOrder || 'ASC',
        ...params?.filters
      }
    });
    return response.data;
  }

  /**
   * Retrieve a specific client by ID
   */
  static async getClient(clientId: number) {
    const response = await apiClient.get(`/clients/${clientId}`);
    return response.data;
  }

  /**
   * Create a new client
   */
  static async createClient(data: CreateClientRequest) {
    const response = await apiClient.post('/clients', {
      ...data,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en',
      active: data.active || false
    });
    return response.data;
  }

  /**
   * Update an existing client
   */
  static async updateClient(clientId: number, data: UpdateClientRequest) {
    const response = await apiClient.put(`/clients/${clientId}`, {
      ...data,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    });
    return response.data;
  }

  /**
   * Activate a client
   */
  static async activateClient(clientId: number, activationDate: string) {
    const response = await apiClient.post(`/clients/${clientId}?command=activate`, {
      activationDate,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    });
    return response.data;
  }

  /**
   * Close a client account
   */
  static async closeClient(clientId: number, closureDate: string, closureReasonId: number) {
    const response = await apiClient.post(`/clients/${clientId}?command=close`, {
      closureDate,
      closureReasonId,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    });
    return response.data;
  }

  /**
   * Delete a client
   */
  static async deleteClient(clientId: number) {
    const response = await apiClient.delete(`/clients/${clientId}`);
    return response.data;
  }

  /**
   * Get client accounts summary
   */
  static async getClientAccounts(clientId: number) {
    const response = await apiClient.get(`/clients/${clientId}/accounts`);
    return response.data;
  }

  /**
   * Upload client image
   */
  static async uploadClientImage(clientId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`/clients/${clientId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  /**
   * Get client image
   */
  static async getClientImage(clientId: number) {
    const response = await apiClient.get(`/clients/${clientId}/images`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Search clients by name or account number
   */
  static async searchClients(query: string, limit = 10) {
    const response = await apiClient.get('/clients', {
      params: {
        sqlSearch: `c.display_name like '%${query}%' or c.account_no like '%${query}%'`,
        limit,
        orderBy: 'displayName',
        sortOrder: 'ASC'
      }
    });
    return response.data;
  }

  /**
   * Get client template for creating new client
   */
  static async getClientTemplate() {
    const response = await apiClient.get('/clients/template');
    return response.data;
  }

  /**
   * Get clients by office
   */
  static async getClientsByOffice(officeId: number) {
    const response = await apiClient.get('/clients', {
      params: {
        officeId,
        limit: 1000,
        orderBy: 'displayName',
        sortOrder: 'ASC'
      }
    });
    return response.data;
  }

  /**
   * Get client transactions
   */
  static async getClientTransactions(clientId: number) {
    const response = await apiClient.get(`/clients/${clientId}/transactions`);
    return response.data;
  }

  /**
   * Transfer client to another office
   */
  static async transferClient(clientId: number, destinationOfficeId: number, transferDate: string) {
    const response = await apiClient.post(`/clients/${clientId}?command=transferOffice`, {
      destinationOfficeId,
      transferDate,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    });
    return response.data;
  }
}

// Export individual functions for easier use
export const {
  getAllClients,
  getClient,
  createClient,
  updateClient,
  activateClient,
  closeClient,
  deleteClient,
  getClientAccounts,
  uploadClientImage,
  getClientImage,
  searchClients,
  getClientTemplate,
  getClientsByOffice,
  getClientTransactions,
  transferClient
} = ClientsApi;
