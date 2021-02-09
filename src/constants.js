export const URL =
  process.env.NODE_ENV === 'production'
    ? 'https://eduzone-server.herokuapp.com'
    : 'http://localhost:3000'

export const products = [
  {
    key: 0,
    price: '$6.00',
    name: 'Basic Math 1-6',
    type: 'math',
    interval: 'month',
    billed: 'mounthy',
  },
  {
    key: 1,
    price: '$9.00',
    name: 'Language Arts 1-5',
    type: 'arts',
    interval: 'month',
    billed: 'mounthy',
  },
  {
    key: 2,
    price: '$12.00',
    name: 'Combo package ELA-Math',
    type: 'ela',
    interval: 'month',
    billed: 'mounthy',
  },
]
