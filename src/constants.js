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
    content: ['Math', 'Grades 1 to 6'],
  },
  {
    key: 1,
    price: '$8.95',
    name: 'Language Arts',
    type: 'arts',
    interval: 'month',
    billed: 'monthly',
    content: ['English Language', 'Grades 1 to 5'],
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
    ],
  },
]

export const faq = [
  {
    title: 'What is Edu-zone?',
    body:
      'Edu-zone is a digital publisher specializing on developing standard-aligned content. These contents offer an interactive experience to engage learners.',
  },
  {
    title: 'What content will I find in the subscription?',
    body:
      'You will find content for English Language & Arts  (Grades 1-5 ), and Mathematics (Grades 1-6).',
  },
  {
    title: 'How much does it cost?',
    body:
      'The subscription starts at 8.95 USD/month. You will only be charged 30 days after your subscription date. You may cancel your subscription at anytime during those first 30 days.',
  },
  {
    title: 'Where can I access Edu-zone?',
    body:
      'Edu-zone can be accessed through these web browsers: Chrome, Safari, Edge.',
  },
  {
    title: 'How do I cancel?',
    body:
      'First, you have to log in on our site: www.eduzonestore.edu-zone.org with your access credentials.  After that, click on : “Cancel subscription”. Even after you cancel, you may continue to enjoy Edu-zone content until the next billing date.',
  },
]
