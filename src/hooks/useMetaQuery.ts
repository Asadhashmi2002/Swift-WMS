import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BusinessManager, WhatsAppBusinessAccount, PhoneNumber, MessageTemplate } from '../types';

// TODO: Replace these mock endpoints with real Meta Graph API calls
const API_BASE = '/mock/graph';

export const useBusinessManagers = () => {
  return useQuery({
    queryKey: ['businessManagers'],
    queryFn: async (): Promise<BusinessManager[]> => {
      const response = await fetch(`${API_BASE}/me/businesses`);
      const data = await response.json();
      return data.data;
    },
  });
};

export const useCreateBusinessManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; gst?: string; pan?: string }): Promise<BusinessManager> => {
      const response = await fetch(`${API_BASE}/business_managers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessManagers'] });
    },
  });
};

export const useWABAs = (businessId?: string) => {
  return useQuery({
    queryKey: ['wabas', businessId],
    queryFn: async (): Promise<WhatsAppBusinessAccount[]> => {
      const response = await fetch(`${API_BASE}/${businessId}/whatsapp_business_accounts`);
      const data = await response.json();
      return data.data;
    },
    enabled: !!businessId,
  });
};

export const useCreateWABA = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ businessId, name }: { businessId: string; name: string }): Promise<WhatsAppBusinessAccount> => {
      const response = await fetch(`${API_BASE}/${businessId}/whatsapp_business_accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wabas', variables.businessId] });
    },
  });
};

export const usePhoneNumbers = (wabaId?: string) => {
  return useQuery({
    queryKey: ['phoneNumbers', wabaId],
    queryFn: async (): Promise<PhoneNumber[]> => {
      const response = await fetch(`${API_BASE}/${wabaId}/phone_numbers`);
      const data = await response.json();
      return data.data;
    },
    enabled: !!wabaId,
  });
};

export const useAddPhoneNumber = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ wabaId, phoneNumber, verifiedName }: { 
      wabaId: string; 
      phoneNumber: string; 
      verifiedName: string; 
    }): Promise<PhoneNumber> => {
      const response = await fetch(`${API_BASE}/${wabaId}/phone_numbers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone_number: phoneNumber, 
          verified_name: verifiedName 
        }),
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['phoneNumbers', variables.wabaId] });
    },
  });
};

export const useRequestVerificationCode = () => {
  return useMutation({
    mutationFn: async ({ phoneId, method }: { phoneId: string; method: 'sms' | 'voice' }) => {
      const response = await fetch(`${API_BASE}/${phoneId}/request_code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code_method: method }),
      });
      return response.json();
    },
  });
};

export const useVerifyCode = () => {
  return useMutation({
    mutationFn: async ({ phoneId, code }: { phoneId: string; code: string }) => {
      const response = await fetch(`${API_BASE}/${phoneId}/verify_code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error('Invalid verification code');
      }
      return response.json();
    },
  });
};

export const useSubscribeWebhook = () => {
  return useMutation({
    mutationFn: async ({ wabaId, webhookUrl, verifyToken }: { 
      wabaId: string; 
      webhookUrl: string; 
      verifyToken: string; 
    }) => {
      const response = await fetch(`${API_BASE}/${wabaId}/subscribed_apps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          callback_url: webhookUrl,
          verify_token: verifyToken,
          fields: ['messages', 'message_deliveries', 'message_reads']
        }),
      });
      return response.json();
    },
  });
};

export const useMessageTemplates = (wabaId?: string) => {
  return useQuery({
    queryKey: ['messageTemplates', wabaId],
    queryFn: async (): Promise<MessageTemplate[]> => {
      const response = await fetch(`${API_BASE}/${wabaId}/message_templates`);
      const data = await response.json();
      return data.data;
    },
    enabled: !!wabaId,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ wabaId, template }: { 
      wabaId: string; 
      template: Omit<MessageTemplate, 'id' | 'status'> 
    }): Promise<MessageTemplate> => {
      const response = await fetch(`${API_BASE}/${wabaId}/message_templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messageTemplates', variables.wabaId] });
    },
  });
};

export const useUploadBusinessDocs = () => {
  return useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach((file, index) => {
        formData.append(`document_${index}`, file);
      });
      
      const response = await fetch('/mock/upload/business-docs', {
        method: 'POST',
        body: formData,
      });
      return response.json();
    },
  });
};

export const useFacebookLogin = () => {
  return useMutation({
    mutationFn: async () => {
      // Mock Facebook OAuth flow
      const response = await fetch('/mock/facebook/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
  });
};