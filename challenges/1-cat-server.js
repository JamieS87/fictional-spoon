const request = require('../utils/server');

function checkServerStatus(callback) {
  request('/status', (err, data)=>{
    if(err) {
      callback(err);
    } else {
      callback(err, data);
    }
  });
}

function fetchBannerContent(callback) {
  request('/banner', (err, data) => {
    if(err) {
      callback(err);
    } else {
      data.copyrightYear = 2023;
      callback(err, {...data});
    }
  });
}

function fetchAllOwners(callback) {
  request('/owners', (err, data) => {
    if(err) {
      callback(err);
    } else {
      const lowered = data.map((ownerName) => {
        return ownerName.toLowerCase();
      })
      callback(err, lowered);
    }
  });
}

function fetchCatsByOwner(name, callback) {
  request(`/owners/${name}/cats`, (err, data) => {
    if(err) {
      callback(err);
    } else {
      callback(err, data);
    }
  });
}

function fetchCatPics(catPics, callback) {

  const responses = [];
  let requestCount = 0;

  for(let i = 0; i < catPics.length; i++) {
    request(`/pics/${catPics[i]}`, (err, response) => {
      requestCount++;
      //console.log(err, response);
      if(err) {
        responses.push('placeholder.jpg');
      } else {
        responses.push(response);
      }
      if(requestCount === catPics.length) {
        callback(err, responses);
      }
    });
  }
}

function fetchAllCats(callback) {
  fetchAllOwners((err, owners) => {
    let cats = [];
    let requests = 0;
    if(err) {
      callback(err);
    } else {
      for(let i = 0; i < owners.length; i++) {
        const ownerName = owners[i];
        fetchCatsByOwner(ownerName, (err, data) => {
          requests++;
          cats = cats.concat(data);
          if(requests === owners.length) {
            cats.sort();
            callback(err, cats);
          }
        });
      }
    }
  });
}

function fetchOwnersWithCats(callback) {
  //callback(null);
  //fetchAllOwners
  //fetchCatsByOwner
  fetchAllOwners((err, owners) => {
    let catsOwners = [];
    catsOwners.length = owners.length;
    let requests = 0;
    if(err) {
      callback(err);
    } else {
      for(let i = 0; i < owners.length; i++) {
        const ownerName = owners[i];
        fetchCatsByOwner(ownerName, (err, data) => {
          requests++;
          catsOwners[i] = {owner: ownerName, cats:data};
          if(requests === owners.length) {
            callback(err, catsOwners);
          }
        });
      }
    }
  });
}

function kickLegacyServerUntilItWorks(callback) {
  //callback(null);
  request('/legacy-status', (err, status) => {
    if(err) {
      kickLegacyServerUntilItWorks(callback)
    } else {
      callback(err, status);
    }
  });
}

function buySingleOutfit(outfit, callback) {
  let calledOnce = false;
  request(`/outfits/${outfit}`, (err, response) => {
    if(!calledOnce) {
      if(err) callback(err);
      else callback(err, response);
      calledOnce = true;
    }
  });
}

module.exports = {
  buySingleOutfit,
  checkServerStatus,
  kickLegacyServerUntilItWorks,
  fetchAllCats,
  fetchCatPics,
  fetchAllOwners,
  fetchBannerContent,
  fetchOwnersWithCats,
  fetchCatsByOwner
};
