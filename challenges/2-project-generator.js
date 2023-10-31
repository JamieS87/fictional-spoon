const fs = require('fs');
const { exec } = require('node:child_process');

function projectGenerator(projectName, cb) {
  fs.mkdir(projectName, (err, path) => {
    if(err) cb(err);
    else {
      fs.writeFile(`./${projectName}/index.js`, '', (err) => {
        if(err) cb(err);
        else {
          fs.writeFile(`./${projectName}/.gitignore`, 'node_modules', (err) => {
            if(err) cb(err);
            else {
              fs.mkdir(`./${projectName}/spec`, (err, path) => {
                if(err) cb(err);
                else {
                  fs.writeFile(`./${projectName}/spec/index.test.js`, '', (err) => {
                    if(err) cb(err);
                    else {
                      fs.writeFile(`./${projectName}/README.md`, `# ${projectName}`, 'utf-8', (err) => {
                        if(err) cb(err);
                        else {
                          exec('git init', {cwd: `./${projectName}`}, (err, stdout, stderr) => {
                            if(err) cb(err);
                            else {
                              fs.writeFile(`./${projectName}/.eslintrc.json`, '', (err) => {
                                if(err) cb(err);
                                else {
                                  exec('npm init -y', {cwd: `./${projectName}`}, (err, stdout, stderr) => {
                                    if(err) cb(err);
                                    fs.readFile(`./${projectName}/package.json`, 'utf-8', (err, data) => {
                                      if(err) cb(err);
                                      else {
                                        const packageObject = JSON.parse(data);
                                        packageObject.devDependencies = {
                                          "jest": "^27.3.1"
                                        }
                                        packageObject.scripts.test = 'jest';
                                        fs.writeFile(`./${projectName}/package.json`, JSON.stringify(packageObject), (err, data) => {
                                          if(err) cb(err);
                                          cb(null);
                                        });
                                      }
                                    });
                                  })
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

module.exports = projectGenerator;
