import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import useFormInput from '../../hooks/useFormInput'

const Subscribe = ({ parentClass = 'hero' }) => {
  const history = useHistory()
  const email = useFormInput('')
  const [loading, setLoading] = useState(false)

  const currentClass = parentClass === 'hero' ? 'hero__' : 'faq__info-'

  const handleSubscribe = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      sessionStorage.setItem('email', email.value)
      history.push('/register')
    }, 200)
    setLoading(false)
  }

  return (
    <form className={`${currentClass}subs`} onSubmit={handleSubscribe}>
      <input
        className={`${currentClass}input`}
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        value={email.value}
        onChange={email.onChange}
        required
      />
      <button className={`${currentClass}button`} type="submit">
        {loading ? 'Loading...' : `Subscribe`}
      </button>
    </form>
  )
}

export default Subscribe
