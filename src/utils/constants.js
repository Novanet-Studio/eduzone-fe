/*export const URL = process.env.NODE_ENV === 'production' 
  ? 'https://eduzone-server.herokuapp.com'
  : 'http://localhost:3000'*/

export const URL = 'https://eduzone-server.herokuapp.com'

export const products = [
  {
    key: 0,
    price: '$6.00',
    name: 'Basic',
    interval: 'month',
    billed: 'mounthy',
  },
  {
    key: 1,
    price: '$9.00',
    name: 'Full',
    interval: 'month',
    billed: 'mounthy',
  },
  {
    key: 2,
    price: '$12.00',
    name: 'Premium',
    interval: 'month',
    billed: 'mounthy',
  },
]