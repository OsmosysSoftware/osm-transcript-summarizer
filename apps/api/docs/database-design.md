# **Database Design**

This document provides a comprehensive and structured overview of the database design for Transcript Summarization App.

It serves as a reference guide for stakeholders, including developers, database administrators, project managers, and other parties involved in the development, maintenance, and understanding of the application's database.

The tables discussed below will be created as part of the database migration.

## **Database Schema**

The database schema consists of the following 2 tables:

- **files :** Contains details about all the user uploaded files with their Task IDs.
- **job** : Contains details about the queue system-related data, such as job metadata and status.

This schema can be visualized in the following image:
![Block Diagram](./assets/transcript-summarization-database-schema.jpg)

## **Data Dictionary**

**files**

| Attribute | Data Type | Not Null | Default | Description |
| --- | --- | --- | --- | --- |
| file_id | int(11) | True |     | Primary key, unique identifier for the uploaded record |
| file_path | varchar(255) |     |     | Stores the File path  |
| file_name | varchar(255) |     |     | Stores the File name |
| status | tinyint | True |     | Stores the response status code of the response |
| created_on | timestamp | True | current_timestamp() | Stores the timestamp for the creation of the record |
| created_by | Varchar(45) | True | admin | Stores the details of creator of the record |
| modified_on | timestamp |     |     | Stores the timestamp for the last update to the record |
| modified_by | Varchar(45) |     |     | Stores the details of Modifier of the record |

**jobs**

| Attribute | Data Type | Not Null | Default | Description |
| --- | --- | --- | --- | --- |
| job_id | int(11) | True |     | Primary key, unique identifier for the uploaded record |
| file_id | varchar(255) | True |     | Stores the ID value for related file_id |
| job_status | enum | True |     | Stores the job status for related job_id |
| input_file | varchar(255) |     |     | References the file stored in files table |
| output_file | varchar(255) |     |     | References the processed file stored in files table |
| status | tinyint | True |     | Stores the active/inactive status of the record |
| created_on | timestamp | True | current_timestamp() | Stores the timestamp for the creation of the record |
| created_by | Varchar(45) | True | admin | Stores the details of creator of the record |
| modified_on | timestamp |     |     | Stores the timestamp for the last update to the record |
| modified_by | Varchar(45) |     |     | Stores the details of Modifier of the record |
 