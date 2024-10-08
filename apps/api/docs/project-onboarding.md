# Project Onboarding

The purpose of this document is to provide comprehensive guidance for onboarding new team members to the Transcript Summarizer project. It serves as a reference for new developers, designers, project managers, and other stakeholders, offering insights into the project's structure, objectives, and essential processes.

## Table of Contents

- [Project Onboarding](#project-onboarding)
  - [Table of Contents](#table-of-contents)
  - [1. Introduction](#1-introduction)
  - [2. Onboarding Checklist](#2-onboarding-checklist)
  - [3. Tools and Technologies](#3-tools-and-technologies)
  - [4. Project Documentation](#4-project-documentation)
  - [5. Project Guidelines](#5-project-guidelines)
  - [6. Workflow](#6-workflow)


## 1. Introduction

Transcript Summarizer is a tool built for Managers and Quality Analysts to summarize calls and create concise and detailed Meeting Minutes.

This user-friendly application enables you to effortlessly generate concise summaries from lengthy transcripts, making it easier to extract key information.

## 2. Onboarding Checklist

- Read the [Introduction](#1-introduction) section of this project documentation for getting required introductory information about the project.

- Get access to the required applications, services and servers.

- Install and configure the tools and technologies used in the project. Refer to the [Tools and Technologies](#3-tools-and-technologies) section for a comprehensive list of different technologies currently in use.

- Review the [Project Guidelines](#5-project-guidelines) section for general guidelines. Take note of where documentation is stored and the importance of keeping it up-to-date.

## 3. Tools and Technologies

The success of the project relies on the effective use of tools and technologies. Familiarize yourself with the following essential tools to streamline your work and collaboration.

**Code Editor:** [Visual Studio Code](https://code.visualstudio.com/download)

**Version Control System (VCS):** [Git](https://git-scm.com/)

**Branching model:** [Osmosys Git Standards](https://github.com/OsmosysSoftware/dev-standards/blob/main/coding-standards/git.md)

**Repository:** [Transcript Summarizer on Github](https://github.com/OsmosysSoftware/osm-transcript-summarizer)

Ensure to setup these project repositories on your local environment for development purposes, following the instructions in corresponding README files.

**AI Tool:** [OpenAI GPT Models](https://platform.openai.com/docs/models)

OpenAI GPT Models provide advanced natural language understanding and response generation capabilities. This AI tool assists in automating text-based tasks, offering smart suggestions, and handling dynamic user interactions. Its lightweight design makes it ideal for applications requiring quick, concise outputs without sacrificing quality.

**Authentication Client:** [Microsoft Azure](https://portal.azure.com/)

Azure Authentication using Microsoft Account can be set up through Azure Active Directory (Azure AD). This is needed for allowing authorized end users to access the Portal and related services.

**Database:** [MariaDB](https://mariadb.org/download)

In addition to the api and portal, a database will also be required to setup. We are utilising latest verison of mariadb-server and the same can be used for local development, either in a docker container or setup directly on the system.

For more details about the database, refer the following [Database Design](./database-design.md) document.

**Tasks and Issues Tracking Platform:** [Pinestem](https://pinestem.com)

The Transcript Summarizer project will be found under the Osmosys instance. Request access to the project by your lead or manager.

## 4. Project Documentation

Effective documentation is essential for knowledge sharing and project continuity. Follow these guidelines to contribute to and utilize project documentation effectively.

**Code Documentation**

Document code using inline comments and follow a consistent style guide. Additionally, maintain the documentation in the repositories up to date as required.

**Repository Documentation**

Use the Transcript Summarizer document folder for project-related documentation as follows:

- [API Documentation](./api-documentation.md)
- [API Test Cases](./api-test-cases.md)
- [Block Diagram](./block-diagram.md)
- [Database Design](./database-design.md)
- Project Setup for API
  - [API Development Setup](./development-setup.md)
  - [API Production Setup](./production-setup.md)
- [Project Setup for Portal](./../../portal/docs/development-setup.md)
- [Usage Guide](./usage-guide.md)

**User Guides**

Create and update user guides for end-users and stakeholders. There are currently the following documents available:

- [Usage Guide](./usage-guide.md)

## 5. Project Guidelines

**General Guidelines**

- Ensure regular updates of your local development environment.

- Follow the branching and code review processes outlined in above document.

- Ensure you are utilising and updating tasks on Pinestem regularly and properly.

- Attend any onboarding sessions or training programs scheduled for new team members. These sessions may cover specific tools, processes, or project-specific information.

- Don't hesitate to ask questions and seek clarifications from your team members, project leads, or mentors. Effective communication is key to a successful onboarding experience.

**Documentation Guidelines**

- Regularly update documentation to reflect changes in code, processes, or project requirements.

- Follow established documentation standards and templates.

- Provide clear and concise information in your documentation.

## 6. Workflow

- A new task will be assigned to you in the Requested status. Before working on the task, update the task status to Development.

- Ensure that you are regularly billing your hours properly in the task. On completion of the task, if the changes require a deployment to live codebase, update the task status to Ready Live. Otherwise, you can mark the status as Done.

- In case you have to switch from this task to actively work on another task, or the task has to be put on hold, update the task status to Requested or On-hold respectively.

- Utilise the comments on a task for adding any discussions had for having a reference for taking certain actions and assisting future you or a new developer on past decisions that were taken.