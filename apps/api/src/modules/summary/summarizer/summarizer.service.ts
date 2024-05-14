import { Injectable } from '@nestjs/common';
import { OpenAI } from 'src/common/openai/openai-client'; // Assume OpenAI client implementation
import { DateTime } from 'luxon'; // Use Luxon for date-time manipulation
import * as fs from 'fs/promises';

@Injectable()
export class MeetingSummaryService {
  constructor(private readonly openAI: OpenAI) {}

  parseTranscript(transcript: string): any[] {
    const lines = transcript.split('\n').map(line => line.trim()).filter(line => line);

    const timePattern = /(\d{1,2}:\d{2}:\d{2}(?:\.\d{1,3})?) --> (\d{1,2}:\d{2}:\d{2}(?:\.\d{1,3})?)/;
    const chunks = [];

    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(timePattern);
      if (match) {
        const start_time = match[1];
        const end_time = match[2];
        if (i + 2 < lines.length) {
          const name = lines[i + 1];
          const content = lines[i + 2];
          chunks.push({
            start_time,
            end_time,
            name,
            content
          });
          i += 2; // Move to the next block
        }
      }
    }
    return chunks;
  }

  async summarizeMeetingUsingChatbot(context: string, duration: string): Promise<string> {
    const formatted_time = DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss");
    const message_template = `
      Act as a meeting note taker. I have a transcript of a teams meeting as follows: ${context}

      I want a summary of the transcript in the following format:

      # Meeting Minutes
      Give appropriate discussion heading
      Created on: ${formatted_time}
      Duration: ${duration}

      # Participants
      Display list of participants name involved

      # Agenda
      Brief summary what the meeting was about in max 3 points

      # Discussion
      Give the main disucssion points and the speaker names. Give answer in points. Be as descriptive as possible.

      # Action items
      Give what was the outcome, tasks assigned, end result if any of the discussion in points
    `;
    console.log('here is the message template' + message_template);
    const chat = await this.openAI.generateSummary(message_template);
    return chat.choices[0].message.content;
  }

  async combineSummariesUsingChatbot(summaries: string[], duration: string): Promise<string> {
    const formatted_time = DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss");
    const message_template = `
      Act as a meeting note summarizer. I have summaries of a teams meeting noted by different people as follows: ${summaries.join('\n')}

      I want a combined summary of the multiple summaries of same call in the following format:

      # Meeting Minutes
      Give appropriate discussion heading
      Created on: ${formatted_time}
      Duration: ${duration}

      # Participants
      Display list of participants name involved

      # Agenda
      Brief summary what the meeting was about in max 3 points

      # Discussion
      Give the main disucssion points and the speaker names. Give answer in points. Be as descriptive as possible.

      # Action items
      Give what was the outcome, tasks assigned, end result if any of the discussion in points
    `;
    
    const chat = await this.openAI.generateSummary(message_template);
    return chat.choices[0].message.content;
  }

    async saveSummaryToFile(summary: string, outputFilePath: string): Promise<void> {
    try {
      fs.writeFile(outputFilePath, summary);
      console.log(`Summary saved to file: ${outputFilePath}`);
    } catch (error) {
      console.error(`Error saving summary to file: ${error.message}`);
      throw error;
    }
  }

  async generateMeetingSummary(inputFilePath: string, outputFilePath: string): Promise<string> {
    try {
      // Read the input file to get the transcript text
      const transcript = await fs.readFile(inputFilePath, 'utf8');
      console.log('here is the transcript' + transcript);
      // Parse the transcript
      const chunks = this.parseTranscript(transcript);
      console.log('Here are the chunks' + chunks);
      const duration = chunks.length > 0 ? chunks[chunks.length - 1].end_time : "00:00:00";
  
      // Summarize the meeting using chatbot for each chunk
      const summaries = await Promise.all(
        chunks.map(chunk => this.summarizeMeetingUsingChatbot(`${chunk.name}: ${chunk.content}`, duration))
      );
  
      // Combine the summaries
      const combinedSummary = await this.combineSummariesUsingChatbot(summaries, duration);
      return combinedSummary;
      // Save the combined summary to the output file
    } catch (error) {
      console.error(`Error generating meeting summary: ${error.message}`);
      throw error;
    }
  }
}
