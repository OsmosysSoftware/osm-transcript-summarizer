# Usage Guide for Transcript Summarizer

## Introduction

Welcome to the usage guide for Transcript Summarizer, a powerful transcript management system designed to simplify the process of creation of summaries from meetings and team call transcripts.

## Table of Contents

- [Usage Guide for Transcript Summarizer](#usage-guide-for-transcript-summarizer)
  - [Introduction](#introduction)
  - [Table of Contents](#table-of-contents)
  - [1. Overview](#1-overview)
  - [2. Setup](#2-setup)
    - [Microsoft account for Azure Authentication](#microsoft-account-for-azure-authentication)
    - [Codebase](#codebase)
  - [3. Using the Transcript Summarizer Portal](#3-using-the-transcript-summarizer-portal)
  - [4. Using the API](#4-using-the-api)
    - [Getting your Microsoft authentication token](#getting-your-microsoft-authentication-token)
    - [Sending an API request](#sending-an-api-request)
  - [5. Job Status Information](#5-job-status-information)

## 1. Overview

Transcript Summarizer is a powerful tool designed to streamline the process of summarizing transcripts. This user-friendly application enables you to effortlessly generate concise summaries from lengthy transcripts, making it easier to extract key information.

## 2. Setup

### Microsoft account for Azure Authentication

Users must have a valid **Microsoft account** for **Azure Authentication**. Ensure that you obtain the necessary credentials `tenantId`, `clientId`, `apiScope` from your Azure account for proper configuration of the Portal environment.

### Codebase

Follow the development setup guides for API and portal to set up the codebase before proceeding further:

1. Set up API:
   - [API Development setup](./development-setup.md)
   - [API Production setup](./production-setup.md)
2. Set up Portal:
   - [Portal Development setup](../../portal/docs/development-setup.md)

## 3. Using the Transcript Summarizer Portal

1. **Start the API**
    Run the scheduler script (see [Codebase Setup](#codebase) for details).
2. **Start the Portal**
    The Transcript Summarizer Portal should now be running locally at:
    - `http://localhost:4200` (Standard setup)
    - `http://localhost:5000` (Docker setup)
3. **Open the Portal URL**
    - You will be prompted to log in to your Microsoft account.
    - Log in using your credentials to access the Transcript Summarization Portal.
4. **Upload Your Transcript**
    - Click the `+ Choose File` button to upload your transcript. Supported file types are `.vtt` and `.txt`.
    - The uploaded raw transcripts will be stored locally in the path specified in `.env` file.
    - Default storage folder: `osm-transcript-summarizer/apps/api/uploads`
5. **Process the Transcript**
    - Click on the `Summarize Me` button to process your transcript.
    - You can monitor the **[job status](#5-job-status-information)** for the summarization process.
    - You can also view a list of summaries created during your session.
6. **Download the Summary**
    - Once the process is successful, click the `Download` button to download the summary as a markdown file.

## 4. Using the API

Developers have the flexibility to either use the Portal directly or interact with the API to upload transcripts and receive summaries for the uploaded files.

When using the API, you'll need to set your **Microsoft authentication token** as a required header.

### Getting your Microsoft authentication token

1. Start the API and scheduler (see [Codebase Setup](#codebase) for details).
2. Start the Portal
3. Transcript Summarizer Portal should be running locally at `http://localhost:4200` (or `http://localhost:5000` for docker setup).
4. Open the portal URL. You will be prompted to log in to your Microsoft account.
5. Before proceeding, open the developer tools of your browser. Popular shortcuts are `ctrl+shift+i` OR `F12`.
6. Navigate to the **Network** tab.
7. Login using your credentials. You will be directed to the Portal.
8. Find the request labeled `token`. From its response data, extract the value associated with the key `access_token`.
9. Use this extracted string as your Bearer token for authenticating API requests.

### Sending an API request

Transcript Summarizer offers a GraphQL endpoint that allows you to upload transcript files and access all your summaries with advanced filtering options. For detailed information, please refer to the following:

- [API documentation](./api-documentation.md)
- [Postman Collection](./../Transcript%20Summarization.postman_collection.json)
- [Postman Environment](./../Transcript%20Summarization.postman_environment.json)

## 5. Job Status Information

Transcript Summarizer provides different job status options to reflect the state of the summary creation process:

| **Status**  |                 **Description**                 | **Value** |
| :---------: | :---------------------------------------------: | :-------: |
|   PENDING   |      The transcript is awaiting processing      |     1     |
|   QUEUED    | The transcript is added to queue for processing |     2     |
| IN PROGRESS |   The transcript is currently being processed   |     3     |
|   SUCCESS   |   The transcript summarization was successful   |     4     |
|   FAILED    |       The transcript summarization failed       |     5     |
