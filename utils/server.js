const db = require('./database');
const {
  checkLegacyStatus,
  getBannerContent,
  checkStatus,
  fetchOwners,
  fetchCatsByOwner,
  buyBuyBuy
} = require('./controllers');

const server = (requestUrl, handleResponse) => {
  const errors = [];
  let response = '';
  const validUrls = {
    '/owners': fetchOwners,
    '/status': checkStatus,
    '/legacy-status': checkLegacyStatus,
    '/banner': getBannerContent
  };
  setTimeout(() => {
    if (/\/owners\/[\W\w]+\/cats/.test(requestUrl)) {
      const owner = requestUrl.split('/')[2];
      response = fetchCatsByOwner(errors, db, owner);
    } else if (/\/outfits/.test(requestUrl)) {
      const outfit = requestUrl.split('/')[2];
      response = buyBuyBuy(errors, db, outfit, handleResponse);
    } else {
      response = validUrls[requestUrl](errors, db);
    }
    if (errors.length) return handleResponse(errors[0]);
    else
      return response
        ? handleResponse(null, response)
        : handleResponse('404 - path not found!');
  }, Math.random() * 200);
};

module.exports = server;
