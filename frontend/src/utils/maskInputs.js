//Mascara de CPF
const cpfMask = (value) => {
  return value
    .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1'); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
};
function maskTel(value) {
  const regex = /^([0-9]{2})([0-9]{4,5})([0-9]{5})$/;
  var str = value.replace(/[^0-9]/g, '').slice(0, 11);

  const result = str.replace(regex, '($1)$2-$3');

  return result;
}

const durationContractMask = (value) => {
  return value.replace(/\D/g, '').replace(/([0-9]{2})+?$/, '$1');
};

export { cpfMask, maskTel, durationContractMask };
