import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class OpenAI {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly httpClient: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey; // Updated to use the provided apiKey parameter instead of process.env.OPENAI_API_KEY
    this.baseURL = 'https://api.openai.com/v1';
    this.httpClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async generateSummary(message: string): Promise<any> {
    try {
      const response = await this.httpClient.post(`${this.baseURL}/completions`, { prompt: message }); // Updated endpoint from '/completion' to '/completions'
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(`Error generating summary: ${error.message}`);
    }
  }
}
