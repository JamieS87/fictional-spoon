const projectGenerator = require('./2-project-generator');
const { exec } = require('node:child_process');

function advancedProjectGenerator(projectName, githubURL, cb) {
  projectGenerator(projectName, (err) => {
    if(err) {
      cb(err);
    } else {
        exec('npm install', {cwd: `./${projectName}`}, (err, stdout, stderr) => {
          if(err) {
            cb(err);
          } else {
            if(githubURL) {
              exec(`git remote add origin ${githubURL}`, {cwd: `./${projectName}`}, (err, stdout, stderr) => {
                if(err) {
                  cb(err);
                } else {
                  cb(null);
                }
              });
            } else {
              cb(null);
            }
          }
        });
    }
  });
}

module.exports = advancedProjectGenerator;