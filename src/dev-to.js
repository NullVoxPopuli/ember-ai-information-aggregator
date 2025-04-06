import { writeFile } from 'node:fs/promises';
import { output } from './file.js';
import { join } from 'node:path';

const { DEV_TO_KEY } = process.env;

const outputFile = join(output, 'dev-to.md');

let tags = {
  ember: {
    id: 3596,
    name: 'ember',
    bg_color_hex: '#E04E39',
    text_color_hex: '#FFFFFF',
  },
};

async function get(endpoint) {
  let url = endpoint.startsWith('https')
    ? endpoint
    : `https://dev.to/api` + endpoint;
  let response = await fetch(url, {
    headers: {
      'api-key': DEV_TO_KEY,
      ACCEPT: 'application/vnd.forem.api-v1+json',
    },
  });

  return response.json();
}

// URL grabbed from the network tab in dev.to
//   https://dev.to/t/ember/latest
let articles = await get(
  `https://dev.to/search/feed_content?per_page=100&page=0&tag=ember&sort_by=published_at&sort_direction=desc&tag_names%5B%5D=ember&approved=&class_name=Article`,
);

/**
 * What we ignore:
 * - The Ember Times, that's captured in the index.js
 *   via git-scraping.
 *
 * - Posts from the emberjs author. These are also captured
 *   via git-scraping.
 *
 * - Known low-quality authors who are maybe copy-pasting
 *   code articles from 10+ years ago.
 *
 * - React exists in the title. 🙃
 */
async function getArticles() {
  let keep = articles.result.filter((x) => {
    let isEmberTimes = x.path.includes('embertimes');
    let isEmberOfficial = x.path.includes('emberjs');
    let isReact = x.title.includes('React');
    let lowQualityAuthors = x.path.includes('wlegard');

    return !isEmberTimes && !isEmberOfficial && !isReact && !lowQualityAuthors;
  });

  return keep;
}

export default async function getAll() {
  let keep = await getArticles();

  let text = '';

  for (let article of keep) {
    let data = await get(`/articles/${article.path}/`);

    text += '\n';
    text += '-----------------------------------------------------------';
    text += '\n';
    text += data.body_markdown;
  }

  await writeFile(outputFile, text);

  return { 'dev.to': 'success' };
}
