const advancedProjectGenerator = require('../challenges/4-advanced-project-generator');
const fs = require('fs');
const { exec } = require('node:child_process');
const removeProject = require('./utils.js');

describe("Advanced project generator features tests", () => {

  beforeEach(done => removeProject('my_new_project', done));
  afterAll(done => removeProject('my_new_project', done));

  test("npm install is run after project creation", done => {
    advancedProjectGenerator('my_new_project', null, () => {
      fs.access('./my_new_project/node_modules', fs.constants.F_OK, (err, contents) => {
        expect(err).toBe(null);
        done();
      });
    });
  });

  test("when passed a github url, adds the url as a remote", done => {
    advancedProjectGenerator('my_new_project', 'https://github.com/test/test.git', () => {
      exec('git ls-remote --get-url origin', {cwd: './my_new_project'}, (err, stdout, stderr) => {
        expect(stdout).toBe('https://github.com/test/test.git\n');
        done();
      });
    });
  });
})