import { Header, Footer } from "../layout"
import './Layout.scss'

const Layout = ({ children }) => (
  <div className="content">
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
)


export default Layout