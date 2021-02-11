const defaultClasses = {
  parent: '',
  title: '',
  body: '',
}

const Accordion = ({ data, classes = defaultClasses }) =>
  data.map((item, index) => (
    <div className={classes.parent} key={index}>
      <h4 className={classes.title}>{item.title}</h4>
      <p className={classes.body}>{item.body}</p>
    </div>
  ))

export default Accordion
