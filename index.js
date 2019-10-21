

// define tests for the file interface
// should read the file if it exists - promise resolve or reject
// Generate a priorityFileQueue and it exits the moment if finds one
// priorityQueue

// generate the right priority Queue for the objects
// priorityQueue: specificity for the priority decreases along the order
// Most specific object like if siteId is defined and the env is not
//   default
// [{env: 'staging', siteId: 'asdf989', config: 'checkout'}, {}]
const fs = require('fs');
const path = require('path');
const readYaml = require('read-yaml');
const merge = require('lodash/merge');

const extensions = ['yml', 'json'];
const DIR_PATH = 'Fixtures/'; // Directory where files are stored
const DEFAULT_ENV = 'production';

/**
 * @func readFile
 * @param {String} [extension] extension e.g. json or yml
 * @param {String} [file] absolute file path
 * @param {String} [siteId] SiteId name e.g. anpl
 * */
function readFile(extension, file, siteId){
  let parsedFileData;
  if(extension === 'json'){
      const fileData = fs.readFileSync(file,'utf-8');
      parsedFileData = JSON.parse(fileData);
  }
  if(extension === 'yml'){
    parsedFileData = readYaml.sync(file);
  }
  parsedFileData = parsedFileData[siteId] ? parsedFileData[siteId] : parsedFileData;
  return parsedFileData;
}

/**
 * @func checkSiteId
 * @param {String} [siteId] SiteId name e.g. anpl
 * */
function checkSiteId(siteId){
  if(siteId) {
      return (siteId.length >= 3 && siteId.length <= 6) || siteId === 'default' ? [siteId, null] : [null];
  }
  else{
    return [null];
  }
}

/**
 * @func getFiles
 * @param {String} config Configuration name e.g. checkout
 * @param {Object} [siteIds] SiteIds Combination of siteId & null -> ['anpl', null]
 * */
function getFiles(config, siteIds) {
    const fileNames = siteIds
        .map(siteId => config + (siteId ? '_' + siteId : ''))
        .map(fname => path.resolve(DIR_PATH, fname))
    const fileNamesWithExtensions = fileNames.reduce((arr, fName) => {
        return [...arr, ...extensions.map(ext => fName + '.' + ext)];
    }, []);
    let setOfFiles = [...new Set(fileNamesWithExtensions)];
    setOfFiles = setOfFiles.filter(file=>{ return fs.existsSync(file)});
    return setOfFiles;
}

/**
 * @func getConfig
 * @param {String} config Configuration name e.g. checkout
 * @param {String} [siteId] SiteId name e.g. anpl
 * @param {String} [env] Environment name e.g. staging
 * */
function getConfig (config, siteId, env) {
  try{
      const siteIds = checkSiteId(siteId); ;
      const files = getFiles(config, siteIds);
      if(siteIds.length === files.length){
          const envs = env !== DEFAULT_ENV ? [env, DEFAULT_ENV] : [DEFAULT_ENV];
          let environmentsData = [], finalObject = {};

          files.forEach(file => {
              const extension = file.match(extensions[0]) ? extensions[0] : extensions[1];
              const fileData = readFile(extension, file, siteId);
              environmentsData.push(fileData);
          });

          envs.forEach(env=>{
              finalObject[env] = {};
              merge(finalObject[env], environmentsData[0][env]);
              if(siteId) merge(finalObject[env], environmentsData[1][env]);
          });
          console.log(JSON.stringify(finalObject));
      }
      else{
        console.log(`File does not exist for ${siteId}.`)
      }
  }
  catch (error) {
    console.log(error);
  }
}


getConfig("checkout", "anp", "staging");
//getConfig("forms_customer", "bkit", "production");
// getConfig("forms_customer", "default", "production");

module.exports = {
  checkSiteId,
  getFiles
}
