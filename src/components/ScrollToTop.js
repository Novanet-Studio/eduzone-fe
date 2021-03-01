const { useEffect } = require("react")
const { useLocation, withRouter } = require("react-router-dom")

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default withRouter(ScrollToTop)
