const faqData = [
  {
    question: 'What is Edu-zone?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adi'
  },
  {
    question: 'What content will i find in the subscription?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adi'
  },
  {
    question: 'How much does it cost?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adi'
  },
  {
    question: 'Where can i access Edu-zone?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adi'
  },
  {
    question: 'How do i cancel?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adi'
  },
]

export const FaqAccordion = () => (
  faqData.map((faq, index) => (
    <div className="faq__drop" key={index}>
      <h4 className="faq__question">{faq.question}</h4>
      <p className="faq__answer">{faq.answer}</p>
    </div>
  ))
);

export default FaqAccordion
