const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;


// 04-07-2020
//Testar Update de Investor e Consultants

//----
//const base_tmp_img = path.resolve("./tmp/uploads");
//----

/**
 * @description Criar pasta no servidor
 * @param {*} path
 * @param {*} options
 * @return Promisse
 */

const mkDir = (path, options={}) => {
  return fsPromises.mkdir(path, {recursive: true, ...options});
}

/**
 * @description Mover aquivos
 * @param {*} odlPath
 * @param {*} newPath
 * @return Promisse
 */

const moveFile = async (odlPath, newPath) => {
  const aNewPath = newPath.split('/');
  aNewPath.pop();
  await mkDir(aNewPath.join('/'));
  return fsPromises.rename(odlPath, newPath);
}

/**
 * @description Verificar se um aquivo existe
 * @param {*} odlPath
 * @return Boolean
 */

const fileExist = (path) => {
  return fsPromises.access(path).then(() => true).catch(() => false);
}

/**
 * @description Apaga aquivo
 * @param {*} path
 * @return Promisse
 */

const removeFile = (path) => {
  if (fileExist(path)) {
    return fsPromises.unlink(path).then().catch((err) => {
      console.log(err.message);
    });
  }
}

module.exports = {
  mkDir,
  moveFile,
  fileExist,
  removeFile
}
