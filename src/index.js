const request = require('request-promise');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const urls = require('./config');

async function getProfilesData(uri) {
  try {
    const options = {
      uri,
      encoding: 'binary',
      transform: (body) => cheerio.load(body.replace(/<br ?\/?>/g, '\n'))
    };
    const $ = await request(options);
    const level = $('strong.citizen_level').text().trim();
    const militaryRank = $('div.citizen_military_box_wide > span.rank_name_holder').first().text().trim();

    return {
      level,
      militaryRank,
    }
  } catch(error) {
    console.log(error);
  }
}

async function getUserData(urls) {
  const promises = urls.map(url => getProfilesData(url));
  const usersData = await Promise.all(promises);
  console.log(usersData);
}

getUserData(urls);




