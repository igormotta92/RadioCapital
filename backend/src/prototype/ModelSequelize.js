const { Model } = require('sequelize');

//Pega o metódo original
const toJSON = Model.prototype.toJSON;

//Substitui pelo novo usando o original internamente
//type "E" = Excluir, "I" inclui
Model.prototype.toJSON = function (attributes = [], type = "E") {
  const obj = toJSON.call(this);

  //Um "toJson" é feito para cada objet de um select passando uma
  //String como contador de registros
  //console.log(typeof attributes, attributes, attributes.length);

  if (typeof attributes != 'object' || !attributes.length) return obj

  if (type.toUpperCase() == 'I') {
    return attributes.reduce((result, attribute) => {
      result[attribute] = obj[attribute];

      return result;
    }, {});
  }

  attributes.map((attribute) => {
    delete obj[attribute];
  }, {});

  return obj;

};
