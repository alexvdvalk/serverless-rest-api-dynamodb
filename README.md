Practice REST API using:

- Serverless Framework
  - httpAPIs
  - typescript with new serverless.ts support
- AWS
- DynamoDB

To Deploy:

- Make sure nodejs is installed, and the serverless framework is installed and configured
- npm install
- sls deploy.

Endpoints:

- GET /todos - Get all records
- GET /todos/{id} - Get single record
- PUT /todos - Create new todo.
- DELETE /todos/{id} - Delete a single todo

PUT Body:
{
"title": "required todo text"
}
