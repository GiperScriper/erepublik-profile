const ids = require('./profileIds');
const profileUrl = 'https://www.erepublik.com/en/citizen/profile/';

const profileUrls = (url, ids) => ids.map(id => ({ id, url: `${url}${id}` }));

module.exports = profileUrls(profileUrl, ids);

