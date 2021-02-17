import {
  Accordion,
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

const Acordion = ({ data }) =>
  data.map((item, index) => (
    <Accordion key={index} {...options}>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>{item.title}</AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <p>{item.body}</p>
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  ))

export default Acordion
