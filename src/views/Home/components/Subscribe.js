import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import useFormInput from '../../../hooks/useFormInput'

const Subscribe = ({ parentClass = 'square-subs' }) => {
  const history = useHistory()
  const email = useFormInput('')
  const [loading, setLoading] = useState(false)

  const currentClass = parentClass === 'square-subs' ? 'square-subs__' : 'square-subs-'

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
    <div className={`${currentClass}info`}>
      <h3 className={`${currentClass}title`}>Discover our interactive eBooks</h3>
      <p className={`${currentClass}text`}>Ready to learn? Enter your email to create or restart your membership</p>
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
        {loading ? 'Loading...' : `Get started »`}
      </button>
    </form>
    </div>
  )
}

export default Subscribe
