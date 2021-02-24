import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function Carousel({ items }) {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: true,
    speed: 5000,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  }
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
