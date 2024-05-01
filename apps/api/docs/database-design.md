# **Database Design**

This document provides a comprehensive and structured overview of the database design for Transcript Summarization App.

It serves as a reference guide for stakeholders, including developers, database administrators, project managers, and other parties involved in the development, maintenance, and understanding of the application's database.

The tables discussed below will be created as part of the database migration.

## **Database Schema**

The database schema consists of the following 3 tables:

- **db_uploads :** Contains details about all the user uploaded files with their Job IDs.
- **db_queue_logs** : Contains details about the queue system-related data, such as job metadata and status.
- **db_monitoring_logs** : Contains details about all the monitoring-related data, such as logs, response status etc.

This schema can be visualized in the following image:
![Block Diagram](./assets/transcript-summarization-database-schema.jpg)

## **Data Dictionary**

**db_uploads**

| Attribute | Data Type | Not Null | Default | Description |
| --- | --- | --- | --- | --- |
| job_id | int(11) | True |     | Primary key, unique identifier for the uploaded record |
| File_path | varchar(255) |     |     | File path of summarized file stored in server after successful processing |
| created_on | timestamp | True | current_timestamp() | Stores the timestamp for the creation of the record |
| created_by | Varchar(45) | True |     | Stores the details of creator of the record |
| modified_on | timestamp | True | current_timestamp() | Stores the timestamp for the last update to the record |
| modified_by | Varchar(45) |     |     | Stores the details of Modifier of the record |

**db_queue_logs**

| Attribute | Data Type | Not Null | Default | Description |
| --- | --- | --- | --- | --- |
| queue_id | int(11) | True |     | Primary key, unique identifier for the uploaded record |
| job_id | varchar(255) | True |     | Stores the ID value for related job_id |
| status | enum | True |     | Stores the response status code of the response |
| created_on | timestamp | True | current_timestamp() | Stores the timestamp for the creation of the record |
| modified_on | timestamp | True | current_timestamp() | Stores the timestamp for the last update to the record |

**db_monitoring_logs**

| Attribute | Data Type | Not Null | Default | Description |
| --- | --- | --- | --- | --- |
| monitor_id | int(15) | True |     | Primary key, unique identifier for the monitor log record |
| queue_id | int(15) | True |     | Stores the ID value for related queue_id |
| job_id | int(15) | True |     | Stores the ID value for related job_id |
| status | boolean | True |     | Stores the response status code of the response |
| message | varchar(45) | True |     | Stores the return message of the response |
| created_on | timestamp | True | current_timestamp() | Stores the timestamp for the creation of the record |