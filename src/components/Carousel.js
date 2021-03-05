import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function Carousel({ items, settings  }) {
  
  return (
    <Slider className="slider" {...settings}>
      {items.map((imagen, i) => (
        <div key={i}>
          <img src={imagen} alt="Alt de la imagen" />
        </div>
      ))}
    </Slider>
  )
}
