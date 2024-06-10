require('dotenv').config();

const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const OpenAI = require('openai');
const request = require('request');

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY2});


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

function getArticleContent(url, callback) {
  const selector = getSelectorForUrl(url);
  if (!selector) {
    callback(new Error('No selector found for this URL'), null);
    return;
  }

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

function getSelectorForUrl(url) {
  for (let key in selectors) {
    if (url.includes(key)) {
      return selectors[key];
    }
  }
  return 'p'; //default selector
}

router.post('/summarize', function(req, res, next) {
  const url = req.body.url;
  const sentences = req.body.sentences || 3;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }else if (sentences < 1 || sentences > 10) {
    return res.status(400).json({ error: 'Number of sentences must be between 1 and 10' });
  }

  getArticleContent(url, function(error, content) {
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch article content' });
    }

    openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: 'Can you shorten this article in its original language using ' + sentences + ' sentences: ' + content }],
      max_tokens: 320
    }).then(response => {
      const { choices: [{ message: { content: text } }] } = response;
      res.json({ original:content , summary: text.trim() });
    }).catch(error => {
      console.error('Error generating summary:', error);
      res.status(500).json({ error: 'Failed to generate summary' });
    });
  });
});;

module.exports = router;