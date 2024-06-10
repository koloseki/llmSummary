require('dotenv').config();

const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const OpenAI = require('openai');
const request = require('request');

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY2});

// Maximum number of summaries to store in the cache
const MAX_CACHE_SIZE = 100

// Define selectors for different websites
const selectors = {
  'www.nature.com': '.c-article-body p',
  'www.pcgamer.com': '#article-body p',
  'www.animenewsnetwork.com': '.meat p',
  'www.gry-online.pl': '.word-txt p',
  'www.antyweb.pl': '.post-body p',
  // Place here selectors for websites you want to scrape
  // Note: The lack of a selector for a website will default it to 'p' and may cause unexpected results
};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', number: process.env.PORT || 3000});
});

//Function to fetch the content of the article from the given URL
function getArticleContent(url, callback) {
  const selector = getSelectorForUrl(url);
  if (!selector) {
    callback(new Error('No selector found for this URL'), null);
    return;
  }

  //Request the webpage content
  request(url, function (error, response, body) {
    if (error) {
      console.error('Error fetching the webpage:', error);
      callback(error, null);
    } else {
      const $ = cheerio.load(body);
      let articleContent = '';
      $(selector).each(function(i, elem) {
        articleContent += $(this).text() + ' ';
      });
      if (articleContent === '') {
        console.log('No content found in the webpage. The webpage content is:', body);
      }
      callback(null, articleContent);
    }
  });
}

// Function returns the selector for the given URL if it is present or returns the default selector
function getSelectorForUrl(url) {
  for (let key in selectors) {
    if (url.includes(key)) {
      return selectors[key];
    }
  }
  return 'p'; //default selector
}

//Array of available models , I recommend use of gpt-4o for better results
const availableModels = ['gpt-4o', 'gpt-3.5-turbo-0125' , 'gpt-4-turbo'];

//Array of available languages
const availableLanguages = ['polish', 'english' , 'german' , 'japanese' , 'french'];

//Cache object to store the article content
const summaryCache = {};

// POST route to summarize an article
router.post('/summarize', function(req, res, next) {
  //get the URL and number of sentences from the request
  const url = req.body.url;
  const sentences = req.body.sentences || 3;
  const maxTokens = req.body.max_tokens || 320;
  const temperature = req.body.temperature || 0.5;
  const model = req.body.model || 'gpt-4o';
  const lang = req.body.lang || 'polish';

  // Validate the input
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }else if (sentences < 1 || sentences > 10) {
    return res.status(400).json({ error: 'Number of sentences must be between 1 and 10' });
  }else if (maxTokens < 1 || maxTokens > 2048) {
    return res.status(400).json({ error: 'Max tokens must be between 1 and 2048' });
  }else if (temperature < 0 || temperature > 1) {
    return res.status(400).json({ error: 'Temperature must be between 0 and 1' });
  }else if (!availableModels.includes(model)) {
    return res.status(400).json({ error: 'Model not supported' });
  }else if (!availableLanguages.includes(lang)) {
    return res.status(400).json({ error: 'Language not supported' });
  }

  // Check if the summary is already in the cache
  if (summaryCache[url]) {
    return res.json({ summary: summaryCache[url] });
  }
  // If the cache size exceeds the maximum size, remove the oldest summary
  if (Object.keys(summaryCache).length > MAX_CACHE_SIZE) {
    const oldestUrl = Object.keys(summaryCache)[0];
    delete summaryCache[oldestUrl];
  }


  // Fetch the article content and generate the summary
  getArticleContent(url, function(error, content) {
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch article content' });
    }

    // Generate the summary using chosen OpenAI's model
    openai.chat.completions.create({
      model: model,
      messages: [{ role: 'system', content: 'Can you shorten this article using ' + sentences + ' sentences: ' + content + " and translate it to " + lang + ' ?'}],
      max_tokens: maxTokens,
      temperature: temperature,
    }).then(response => {
      const { choices: [{ message: { content: text } }] } = response;

        // Store the summary in the cache
      summaryCache[url] = text.trim();

      res.json({
        /* uncomment the below line to get the content of the article in the response
          original:content ,
         */
        language: lang,
        summary: text.trim()
      });
    }).catch(error => {
      console.error('Error generating summary:', error);
      res.status(500).json({ error: 'Failed to generate summary' });
    });
  });
});;

module.exports = router;

//Exports for testing
module.exports.getSelectorForUrl = getSelectorForUrl;
module.exports.getArticleContent = getArticleContent;