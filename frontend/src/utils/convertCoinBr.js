export default function (value) {
  return Intl.NumberFormat('pt-Br', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
