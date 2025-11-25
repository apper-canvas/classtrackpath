import { toast } from "react-toastify";
import React from "react";

class ApperClientSingleton {
  constructor() {
    this.instance = null;
    this.initialized = false;
    this.initializationPromise = null;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  async getInstance() {
    if (this.instance && this.initialized) {
      return this.instance;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initializeClient();
    return this.initializationPromise;
  }

  async initializeClient() {
    try {
      // Wait for ApperSDK to be available with timeout
      let attempts = 0;
      const maxAttempts = 50;
      
      while (!window.ApperSDK && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded after 5 seconds. Please ensure the SDK script is included.');
      }

      const { ApperClient } = window.ApperSDK;
      
      if (!ApperClient) {
        throw new Error('ApperClient not found in ApperSDK');
      }

      // Verify environment variables
      const projectId = import.meta.env.VITE_APPER_PROJECT_ID;
      const publicKey = import.meta.env.VITE_APPER_PUBLIC_KEY;

      if (!projectId || !publicKey) {
        throw new Error('Missing required environment variables: VITE_APPER_PROJECT_ID or VITE_APPER_PUBLIC_KEY');
      }

      this.instance = new ApperClient({
        apperProjectId: projectId,
        apperPublicKey: publicKey
      });

      // Test the connection with a simple operation
      try {
        await this.testConnection();
        this.initialized = true;
        this.retryCount = 0;
        console.log('ApperClient initialized successfully');
        return this.instance;
      } catch (testError) {
        console.error('ApperClient connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }

    } catch (error) {
      console.error('ApperClient initialization failed:', error);
      this.instance = null;
      this.initialized = false;
      this.initializationPromise = null;
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retrying ApperClient initialization (${this.retryCount}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
        return this.initializeClient();
      }
      
      throw error;
    }
  }

  async testConnection() {
    if (!this.instance) {
      throw new Error('ApperClient instance not available');
    }

    // Simple test to verify the client can make requests
    try {
      const testParams = {
        fields: [{"field": {"Name": "Id"}}],
        pagingInfo: { limit: 1, offset: 0 }
      };
      
      // Try to fetch from a table that should exist
      await this.instance.fetchRecords('students_c', testParams);
    } catch (error) {
      // If it's a network error, propagate it
      if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        throw new Error('Network connection failed. Please check your internet connection.');
      }
      // Other errors might be expected (e.g., table not found, permissions)
      // so we don't throw them during connection test
    }
  }

  reset() {
    this.instance = null;
    this.initialized = false;
    this.initializationPromise = null;
    this.retryCount = 0;
  }
}

const apperClientSingleton = new ApperClientSingleton();

export const getApperClient = async () => {
  try {
    return await apperClientSingleton.getInstance();
  } catch (error) {
    console.error('Failed to get ApperClient:', error);
    toast.error(`Database connection failed: ${error.message}`);
    return null;
  }
};

export const resetApperClient = () => {
  apperClientSingleton.reset();
};

function getSingleton() {
  return apperClientSingleton;
}
export default getSingleton;