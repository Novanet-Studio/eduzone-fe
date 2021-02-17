import {
  Accordion as AccordionWrapper,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css'

const options = {
  allowMultipleExpanded: true,
  allowZeroExpanded: true,
}

const Accordion = ({ data }) =>
  data.map((item, index) => (
    <AccordionWrapper key={index} {...options}>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>{item.title}</AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <p>{item.body}</p>
        </AccordionItemPanel>
      </AccordionItem>
    </AccordionWrapper>
  ))

export default Accordion
