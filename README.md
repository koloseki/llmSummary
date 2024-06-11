# llSummary

This project involves the creation of a server-side application built with Node.js that leverages a Large Language Model (LLM) to generate short summaries of articles. The application exposes this functionality through a RESTful API, allowing users to submit articles and receive concise summaries in response.

## Table of Contents

- [Getting Started](#getting-started)
  - [Requirements](#Requirements)
  - [Installation](#installation)
  - [Tests](#tests)
- [Usage](#usage)
  - [Google Cloud](#google-cloud)
  - [Docker](#docker)
- [Built With](#built-with-openai)
- [License](#license)

## Getting Started

### Requirements

- Node.js
- npm
- OpenAI API Key
- Docker (Optional)

### Installation

1. Clone the repository to your device using 
```bash 
git clone https://github.com/koloseki/llmSummary.git
 ```
2. Navigate to the project directory using 
```bash
cd llmSummary
```
3. Install dependencies using
```bash
npm install
```
4. Create a `.env` file and add your OpenAI API Key as `OPENAI_API_KEY`. </n>
5. Start the server using
```bash
npm start
```

## Tests

Run `npm test` to run tests. If you install the project using the steps above, you should see a message informing you that the tests are passing.
If you see an error, make sure you have followed the steps correctly.

```bash
npm test
```


## Usage

To use the llSummary application, you need to make a POST request to the `/summarize` endpoint. The request body should be a JSON object with the following properties:

- `url`: The URL of the article you want to summarize.
- `sentences`: (Optional) The number of sentences you want in the summary. Must be between 1 and 10. Default is 4.
- `max_tokens`: (Optional) The maximum number of tokens in the summary. Must be between 1 and 2048. Default is 320.
- `temperature`: (Optional) The temperature of the model's output. Must be between 0 and 1. Default is 0.5.
- `model`: (Optional) The model to use for summarization. Must be one of 'gpt-4o', 'gpt-3.5-turbo-0125', 'gpt-4-turbo'. Default is 'gpt-4o'.
- `lang`: (Optional) The language to translate the summary to. Must be one of 'polish', 'english', 'german', 'japanese', 'french'. Default is 'polish'.

You can change the limit of the number of sentences and tokens in the summary by changing the `sentences` and `max_tokens` properties in the request body. You can also change the temperature of the model's output by changing the `temperature` property.
You can also add any text model from [OpenAi Docs](https://platform.openai.com/docs/models) to the array of models called availableModels in the file `route/index.js` to use it in the API.
And any language to the array of languages called availableLanguages in the file `route/index.js`.

Here is an example of how to use the API with curl:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "url": "https://example.com/article",
  "sentences": 5,
  "max_tokens": 500,
  "temperature": 0.7,
  "model": "gpt-4o",
  "lang": "english"
}' http://localhost:3000/summarize
```
This will return a JSON object with the summarized text in the `summary` property. For example:

```json
{
  "summary": "This is a summary of the article."
}
```

You can also use the API with a tool like Postman or Insomnia by sending a POST request to `http://localhost:3000/summarize` with the same JSON object in the request body.

### Google Cloud 

I also hosted the application on Google Cloud. You can access the API using the following URL: https://llmsummary-woblmnvrkq-lm.a.run.app </n>
You can use the same steps as above to use the API on Google Cloud.
Send a POST request to `https://llmsummary-woblmnvrkq-lm.a.run.app/summarize` with the same JSON object in the request body.

### Docker

You can also run the application using Docker. To do this, you need to have Docker installed on your machine. </n>
Run the following command to build the Docker image:

```bash
docker build -t llmsummary .
```
After the image is built, you can run the container using the following command:

```bash
docker run -p 8080:3000 -d llmsummary
```
This will start the container and expose the application on port 8080. You can then access the API by sending a POST request to `http://localhost:8080/summarize` with the same JSON object in the request body.

## Built With OpenAI

This application is created using OpenAI's powerful language models in mind. OpenAI provides a robust API that allows developers to leverage their models for various tasks such as text generation, translation, summarization, and more.

For more information about OpenAI and their API, visit the [OpenAI API Documentation](https://platform.openai.com/docs/api-reference).

## License

This project is open-source and available under the MIT License.