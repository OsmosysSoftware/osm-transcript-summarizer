import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

interface Chunk {
  startTime: string;
  endTime: string;
  name: string;
  content: string;
}
const GPT_MODEL = 'gpt-3.5-turbo';

@Injectable()
export class MeetingSummaryService {
  private readonly openAI: OpenAI;
  private readonly logger = new Logger(MeetingSummaryService.name);
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error('Missing OpenAI API key');
    }

    this.openAI = new OpenAI({ apiKey });
  }

  async parseTranscript(fileContent: string): Promise<Chunk[]> {
    const lines = fileContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);
    const timePattern =
      /(\d{1,2}:\d{2}:\d{2}(?:\.\d{1,3})?) --> (\d{1,2}:\d{2}:\d{2}(?:\.\d{1,3})?)/;
    const chunks: Chunk[] = [];
    let i = 0;

    while (i < lines.length) {
      const match = lines[i].match(timePattern);

      if (match) {
        const [startTime, endTime] = match.slice(1, 3);

        if (i + 2 < lines.length) {
          const name = lines[i + 1];
          const content = lines[i + 2];
          chunks.push({ startTime, endTime, name, content });
        }

        i += 3;
      } else {
        i += 1;
      }
    }

    return chunks;
  }

  calculateDuration(chunks: Chunk[]): string {
    if (!chunks.length) {
      return '00:00:00';
    }

    return chunks[chunks.length - 1].endTime;
  }

  async summarizeMeetingUsingChatbot(context: string, duration: string): Promise<string> {
    const formattedTime = new Date().toISOString().split('T').join(' ').split('.')[0];
    const messageTemplate = `
      Act as a meeting note taker. I have a transcript of a teams meeting as follows: ${context}

      I want a summary of the transcript in the following format:

      # Meeting Minutes
      Give appropriate discussion heading
      Created on: ${formattedTime}
      Duration: ${duration}

      # Participants
      Display list of participants name involved

      # Agenda
      Brief summary what the meeting was about in max 3 points

      # Discussion
      Give the main discussion points and the speaker names. Give answer in points. Be as descriptive as possible.

      # Action items
      Give what was the outcome, tasks assigned, end result if any of the discussion in points
    `;

    const chat = await this.openAI.chat.completions.create({
      model: GPT_MODEL,
      messages: [{ role: 'user', content: messageTemplate }],
    });

    return chat.choices[0].message.content;
  }

  async createBatches(chunks: string[], maxTokens = 5000): Promise<string[]> {
    const batches: string[] = [];
    let currentBatch: string[] = [];
    let currentLength = 0;

    for (const chunk of chunks) {
      const chunkLength = chunk.split(' ').length;

      if (currentLength + chunkLength > maxTokens) {
        batches.push(currentBatch.join(' '));
        currentBatch = [chunk];
        currentLength = chunkLength;
      } else {
        currentBatch.push(chunk);
        currentLength += chunkLength;
      }
    }

    if (currentBatch.length) {
      batches.push(currentBatch.join(' '));
    }

    return batches;
  }

  async parallelSummarize(batches: string[], duration: string): Promise<string[]> {
    const summaries = await Promise.all(
      batches.map((batch) => this.summarizeMeetingUsingChatbot(batch, duration)),
    );
    return summaries;
  }

  async recursiveCombineSummaries(summaries: string[], duration: string): Promise<string> {
    while (summaries.length > 1) {
      const newSummaries: string[] = [];

      for (let i = 0; i < summaries.length; i += 2) {
        if (i + 1 < summaries.length) {
          const combinedSummary = await this.summarizeMeetingUsingChatbot(
            `${summaries[i]} ${summaries[i + 1]}`,
            duration,
          );
          newSummaries.push(combinedSummary);
        } else {
          newSummaries.push(summaries[i]);
        }
      }

      summaries = newSummaries;
    }

    return summaries[0];
  }

  async generateMeetingSummary(transcript: string): Promise<string> {
    try {
      const chunks = await this.parseTranscript(transcript);
      const formattedChunks = chunks.map((chunk) => `${chunk.name}: ${chunk.content}`);
      const duration = this.calculateDuration(chunks);
      const batches = await this.createBatches(formattedChunks);
      const initialSummaries = await this.parallelSummarize(batches, duration);
      const finalSummary = await this.recursiveCombineSummaries(initialSummaries, duration);
      return finalSummary;
    } catch (error) {
      this.logger.error(`Error generating summary`);
      this.logger.error(JSON.stringify(error, ['message', 'stack'], 2));
      throw error;
    }
  }
}
