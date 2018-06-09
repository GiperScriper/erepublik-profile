const request = require('request-promise');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fs = require('fs');
const moment = require('moment');
const urls = require('./config');

const getCurrentExp = data => data.split('/')[0].trim();

async function getProfilesData(data) {
  try {
    const options = {
      uri: data.url,
      encoding: 'binary',
      transform: (body) => cheerio.load(body.replace(/<br ?\/?>/g, '\n'))
    };
    const $ = await request(options);
    const currentExp = getCurrentExp(
      $('strong.citizen_level')[0].attribs.title.replace(/[^0-9]+/, '')
    );

    const militaryExp = getCurrentExp($('#tankRankNumber').text());
    const airCraftExp = getCurrentExp($('#airRankNumber').text());
    const isWarStash = !!$('ul.active_bonuses > li > span.rank_points').prop('title');
    const isPowerPack = !!$('ul.active_bonuses > li > span.energy_recovery').prop('title');

    return {
      id: data.id,
      currentExp,
      militaryExp,
      airCraftExp,
      isWarStash,
      isPowerPack,
    }
  } catch(error) {
    console.log(error);
  }
}

function saveDataToFile(data) {
  fs.writeFile(`data-${ moment().format("MMM-Do-YY--h-mm-ss")}.json`, JSON.stringify(data), 'utf8', (err, data) => {
   if (err) {
    return console.log(err);
   }
    console.log('*********** DATA SAVED **********');
  });
}


async function getUserData(urls) {
  const promises = urls.map(url => getProfilesData(url));
  const usersData = await Promise.all(promises);
  console.log(usersData);
  saveDataToFile(usersData);
}

getUserData(urls);




