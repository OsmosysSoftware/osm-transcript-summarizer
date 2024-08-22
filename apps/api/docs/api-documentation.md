# API Documentation

This document provides a brief overview of the different API endpoints, their usage and purpose.

## File Upload using graphQL

Allows the user to upload a file. This is called when a user uploads a transcript file to generate a transcript summary.

**Endpoint:** `http://localhost:3000/graphql`

**Method:** `POST`

**Headers:**

| Key | Value | Description |
| --- | ----- | ----------- |
| Accept-Encoding | gzip, deflate, br | Indicates the content encoding that the client can understand |
| Content-Type | application/json | Indicate the original media type of the resource prior to any content encoding applied before transmission |
| Accept | application/json | Indicates which content types, expressed as MIME types, the client is able to understand |
| Connection | keep-alive | The Keep-Alive general header allows the sender to hint about how the connection may be used to set a timeout and a maximum amount of requests |
| Authorization | Bearer auth-token | Microsoft account jwt bearer auth token |
| x-apollo-operation-name | createSummary | Custom header to call createSummary operation |

**Body:** `form-data`

| Key | Type | Value | Description |
| --- | ---- | ----- | ----------- |
| `operations` | Text | `{"query":"mutation ($file: Upload!) {\n  createSummary(createSummaryInput: { inputFile: $file }) {\n    jobId\n  }\n}"}` | Parameterized GraphQL query to upload file for processing. |
| `map` | Text | `{"0": ["variables.file"]}` | Used to map the uploaded file and GraphQL query. |
| `0` | File | `@"/home/user/sample-transcript.txt"` | Transcript file uploaded from local machine for processing. **Allowed extensions:** `.txt`, `.vtt` |

**cURL**

```sh
curl --location 'http://localhost:3000/graphql' \
--header 'Accept-Encoding: gzip, deflate, br' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Connection: keep-alive' \
--header 'Origin: chrome-extension://flnheeellpciglgpaodhkhmapeljopja' \
--header 'x-apollo-operation-name: createSummary' \
--header 'Authorization: Bearer auth-token' \
--form 'operations="{\"query\":\"mutation (\$file: Upload\!) {\\n  createSummary(createSummaryInput: { inputFile: \$file }) {\\n    jobId\\n  }\\n}\"}"' \
--form 'map="{\"0\": [\"variables.file\"]}"' \
--form '0=@"/home/user/sample-transcript.txt"'
```

**Sample response**

```json
{
    "data": {
        "createSummary": {
            "jobId": 1
        }
    }
}
```

## Fetch all Summaries

Allows the user to fetch all summaries based on the passed query parameters. Requires passing bearer token for authorization.

The different options that can be used while fetching summaries are as follows:

- `limit:` Limit the number of results to the provided value
- `offset:` Offset the result set by the provided value
- `sortBy:` Sort the results by the provided key
- `sortOrder:` Sort the results in either `ASC`ending or `DESC`ending order
- `search:` Display those results which contain the input string. Searchable fields: `inputFile`, `createdBy`, `outputText`
- `filters:` Filter the results based on the provided `createdOn` and `createdBy`. Operator can be `eq` (equal), `ne` (not equal), `contains`, `gt` (greater than) or `lt` (less than)

**Endpoint:** `http://localhost:3000/graphql`

**Method:** `POST`

**Headers:**

| Key | Value | Description |
| --- | ----- | ----------- |
| Accept-Encoding | gzip, deflate, br | Indicates the content encoding that the client can understand |
| Content-Type | application/json | Indicate the original media type of the resource prior to any content encoding applied before transmission |
| Accept | application/json | Indicates which content types, expressed as MIME types, the client is able to understand |
| Connection | keep-alive | The Keep-Alive general header allows the sender to hint about how the connection may be used to set a timeout and a maximum amount of requests |
| Authorization | Bearer auth-token | Microsoft account jwt bearer auth token |

**Body:** `graphql`

```graphql
{
  summaries(
    options: {
      limit: 10
      offset: 0
      sortOrder: ASC
      search: "John Doe" # Remove search if you want complete data
      filters: [ # Remove filter if you want complete data
        { field: "createdOn", operator: "gte", value: "2023-01-01" } # Specify the date range to fetch record
        { field: "createdOn", operator: "lte", value: "2024-06-06" } # Specify the upper limit for the date range
        { field: "createdBy", operator: "in", value: "[\"user@example.com\",\"admin@example.com\"]" } # Specify the email id of the person whose record you want to find
      ]
    }
  ) {
    limit
    offset
    summaries {
      createdBy
      createdOn
      jobId
      inputFile
      jobStatus
      modifiedBy
      modifiedOn
      outputText
      status
    }
    total
  }
}
```

**cURL**

```sh
curl --location 'http://localhost:3000/graphql' \
--header 'Accept-Encoding: gzip, deflate, br' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Connection: keep-alive' \
--header 'Origin: chrome-extension://flnheeellpciglgpaodhkhmapeljopja' \
--header 'Authorization: Bearer auth-token' \
--data-raw '{"query":"{\n  summaries(\n    options: {\n      limit: 10\n      offset: 0\n      sortOrder: ASC\n      search: \"John Doe\" # Remove search if you want complete data\n      filters: [ # Remove filters if you want complete data\n        { field: \"createdOn\", operator: \"gte\", value: \"2023-01-01\" } # Specify the date range to fetch record\n        { field: \"createdOn\", operator: \"lte\", value: \"2024-06-06\" } # Specify the upper limit for the date range\n        { field: \"createdBy\", operator: \"in\", value: \"[\\\"user@example.com\\\",\\\"admin@example.com\\\"]\" } # Specify the email id of the person whose record you want to find\n      ]\n    }\n  ) {\n    limit\n    offset\n    summaries {\n      createdBy\n      createdOn\n      jobId\n      inputFile\n      jobStatus\n      modifiedBy\n      modifiedOn\n      outputText\n      status\n    }\n    total\n  }\n}\n","variables":{}}'
```

**Sample response**

```json
{
    "data": {
        "summaries": {
            "limit": 1,
            "offset": 0,
            "summaries": [
                {
                    "createdBy": "user@example.com",
                    "createdOn": "2024-08-13T08:26:17.000Z",
                    "jobId": 1,
                    "inputFile": "933b7c65a8_sample-site-creation.txt",
                    "jobStatus": 4,
                    "modifiedBy": "user@example.com",
                    "modifiedOn": "2024-08-13T08:26:17.000Z",
                    "outputText": "# Meeting Minutes\n**Discussion Heading:** Angular Login Page Layout  \n**Created on:** 2024-08-13 08:26:20  \n**Duration:** 00:06:10  \n\n# Participants\n- John Doe  \n- Amy Smith  \n- Troy Pines  \n\n# Agenda\n- Discuss the layout and features for the Angular login page.\n- Ensure user experience and security are prioritized.\n- Explore design options and technical implementations.\n\n# Discussion\n- **Form Layout:**  \n  - **Amy Smith:** Suggested starting with a simple form layout for ease of use.  \n  - **Troy Pines:** Agreed, emphasizing that simplicity is crucial for user experience.  \n\n- **Social Media Login Options:**  \n  - **John Doe:** Proposed including social media login options.  \n  - **Amy Smith:** Supported the idea for convenience.  \n  - **Troy Pines:** Cautioned against overcrowding the interface.  \n\n- **Forgot Password Link:**  \n  - **John Doe:** Suggested adding a forgot password link.  \n  - **Amy Smith:** Confirmed its necessity as a common user expectation.  \n  - **Troy Pines:** Mentioned integrating it seamlessly into the design.  \n\n- **Animations:**  \n  - **John Doe:** Inquired about the need for animations.  \n  - **Amy Smith:** Suggested subtle animations to enhance user experience.  \n  - **Troy Pines:** Recommended keeping animations smooth and non-distracting.  \n\n- **Two-Factor Authentication:**  \n  - **John Doe:** Asked about implementing two-factor authentication.  \n  - **Amy Smith:** Supported it for added security.  \n  - **Troy Pines:** Highlighted the importance of user-friendliness.  \n\n- **Dark Mode Option:**  \n  - **John Doe:** Proposed incorporating a dark mode option.  \n  - **Amy Smith:** Agreed, noting it allows for user customization.  \n  - **Troy Pines:** Mentioned it caters to different user preferences.  \n\n- **Styling with Angular Material:**  \n  - **John Doe:** Suggested using Angular Material for styling.  \n  - **Amy Smith:** Pointed out its ready-made components could save time.  \n  - **Troy Pines:** Stressed the need for alignment with design principles.  \n\n- **Mobile Responsiveness:**  \n  - **John Doe:** Raised the need for mobile responsiveness.  \n  - **Amy Smith:** Confirmed its importance for mobile users.  \n  - **Troy Pines:** Committed to prioritizing a seamless mobile experience.  \n\n- **Error Handling Features:**  \n  - **John Doe:** Asked about including error handling features.  \n  - **Amy Smith:** Affirmed its necessity for guiding users.  \n  - **Troy Pines:** Suggested clear error messages to prevent frustration.  \n\n- **Google Analytics Integration:**  \n  - **John Doe:** Proposed integrating Google Analytics for tracking.  \n  - **Amy Smith:** Supported it for valuable insights.  \n  - **Troy Pines:** Emphasized compliance with privacy regulations.  \n\n- **Stay Logged In Option:**  \n  - **John Doe:** Suggested allowing users to stay logged in.  \n  - **Amy Smith:** Agreed, with a logout option for security.  \n  - **Troy Pines:** Committed to implementing secure session management.  \n\n- **Progress Indicator During Login:**  \n  - **John Doe:** Proposed adding a progress indicator.  \n  - **Amy Smith:** Supported it for user feedback.  \n  - **Troy Pines:** Suggested keeping it subtle yet informative.  \n\n- **CAPTCHA Implementation:**  \n  - **John Doe:** Asked about implementing CAPTCHA.  \n  - **Amy Smith:** Suggested it to prevent bot attacks.  \n  - **Troy Pines:** Recommended using it sparingly to avoid inconvenience.  \n\n- **User Profile Customization:**  \n  - **John Doe:** Suggested allowing users to customize their profiles.  \n  - **Amy Smith:** Supported personalization for engagement.  \n  - **Troy Pines:** Mentioned providing options within reasonable limits.  \n\n- **Tooltips for Form Inputs:**  \n  - **John Doe:** Proposed incorporating tooltips for form inputs.  \n  - **Amy Smith:** Suggested they clarify input requirements.  \n  - **Troy Pines:** Emphasized the need for concise and helpful tooltips.  \n\n- **Password Change Feature:**  \n  - **John Doe:** Asked about allowing users to change their passwords.  \n  - **Amy Smith:** Confirmed it's a standard security feature.  \n  - **Troy Pines:** Committed to providing a straightforward process.  \n\n- **Multi-Language Support:**  \n  - **John Doe:** Suggested implementing multi-language support.  \n  - **Amy Smith:** Supported it for global user base expansion.  \n  - **Troy Pines:** Stressed the importance of accurate translations.  \n\n- **Terms of Service Agreement:**  \n  - **John Doe:** Proposed incorporating a terms of service agreement.  \n  - **Amy Smith:** Confirmed its necessity for legal compliance.  \n  - **Troy Pines:** Committed to making it easily accessible.  \n\n- **Password Strength Validation:**  \n  - **John Doe:** Suggested implementing password strength validation.  \n  - **Amy Smith:** Supported it to encourage secure passwords.  \n\n# Action Items\n- Develop a simple form layout with social media login options while avoiding interface overcrowding.\n- Integrate a forgot password link and ensure seamless design integration.\n- Implement subtle animations and two-factor authentication, focusing on user-friendliness.\n- Incorporate a dark mode option and use Angular Material for styling, ensuring design principle alignment.\n- Ensure mobile responsiveness and prioritize a seamless mobile experience.\n- Include error handling features with clear messages to guide users.\n- Integrate Google Analytics while ensuring compliance with privacy regulations.\n- Implement secure session management for the stay logged in feature.\n- Add a progress indicator during login and use CAPTCHA sparingly.\n- Allow user profile customization and incorporate tooltips for form inputs.\n- Provide a straightforward password change process and implement multi-language support with accurate translations.\n- Include a terms of service agreement and implement password strength validation.",
                    "status": 1
                }
            ],
            "total": 12
        }
    }
}
```
