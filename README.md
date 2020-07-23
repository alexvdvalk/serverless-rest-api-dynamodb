Practice REST API using:

- Serverless Framework
  - httpAPIs
  - typescript with new serverless.ts support
- DynamoDB

To Deploy:

- npm install
- sls deploy.

Endpoints:
GET /todos - Get all records
GET /todos/{id} - Get single record
PUT /todos - Create new todo.
DELETE /todos/{id} - Delete a single todo

PUT Body:
{
"text": "required todo text"
}
