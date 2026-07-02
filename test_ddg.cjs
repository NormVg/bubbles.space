const cheerio = require('cheerio');
fetch('https://lite.duckduckgo.com/lite/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'q=test'
}).then(r=>r.text()).then(html => {
  const $ = cheerio.load(html);
  const results = [];
  $('tr').each((i, el) => {
    const titleEl = $(el).find('.result-title');
    if (titleEl.length) {
      const snippet = $(el).next().find('.result-snippet').text().trim();
      results.push({
        title: titleEl.text().trim(),
        url: titleEl.attr('href'),
        snippet
      });
    }
  });
  console.log(results);
});
