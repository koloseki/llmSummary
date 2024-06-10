require('dotenv').config();

const OpenAI  = require('openai');

describe('OpenAI API Key', () => {
    it('should be able to make a request with the API key', async () => {
        const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY2});

        let errorOccurred = false;
        try {
            await openai.chat.completions.create({
                messages: [{ role: "system", content: "You are a helpful assistant." }],
                model: "gpt-3.5-turbo-0125",
            });
        } catch (error) {
            errorOccurred = true;
        }

        expect(errorOccurred).toBe(false);
    });
});;