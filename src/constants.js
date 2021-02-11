export const URL =
  process.env.NODE_ENV === 'production'
    ? 'https://eduzone-server.herokuapp.com'
    : 'http://localhost:3000'

export const products = [
  {
    key: 0,
    price: '$8.95',
    name: 'Math',
    type: 'math',
    interval: 'month',
    billed: 'monthly',
    content: [
      'Math',
      'Grades 1 to 6',
    ]
  },
  {
    key: 1,
    price: '$8.95',
    name: 'Language Arts',
    type: 'arts',
    interval: 'month',
    billed: 'monthly',
    content: [
      'English Language',
      'Grades 1 to 5'
    ]
  },
  {
    key: 2,
    price: '$12.95',
    name: 'Combo package',
    type: 'ela',
    interval: 'month',
    billed: 'monthly',
    content: [
      'Math & English Language',
      'ELA Grades 1 to 5',
      'Math Grades 1 to 6',
    ]
  },
]

export const faq = [
  {
    title: 'What is Edu-zone?',
    body: 'Lorem ipsum dolor sit amet, consectetur adi'
  },
  {
    title: 'What content will i find in the subscription?',
    body: 'Lorem ipsum dolor sit amet, consectetur adi'
  },
  {
    title: 'How much does it cost?',
    body: 'Lorem ipsum dolor sit amet, consectetur adi'
  },
  {
    title: 'Where can i access Edu-zone?',
    body: 'Lorem ipsum dolor sit amet, consectetur adi'
  },
  {
    title: 'How do i cancel?',
    body: 'Lorem ipsum dolor sit amet, consectetur adi'
  },
]
