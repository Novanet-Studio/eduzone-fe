import { useState } from 'react'
import { useGlobal } from '../context/globalContext'

export const Subscribe = ({ parentClass = 'hero', subscribe }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { updateFormState } = useGlobal()

  const currentClass = parentClass === 'hero' ? 'hero__' : 'faq__info-'

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Main subscription')
    setLoading(true)
    updateFormState({ email })
    setTimeout(() => subscribe(true), 200)
    setLoading(false)
  }

  const handleChange = ({ currentTarget }) => setEmail(currentTarget.value)

  return (
    <form className={`${currentClass}subs`} onSubmit={handleSubmit}>
      <input
        className={`${currentClass}input`}
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        value={email}
        onChange={handleChange}
        required
      />
      <button className={`${currentClass}button`} type="submit">
        {loading ? 'Loading...' : `Subscribe`}
      </button>
    </form>
  )
}

export default Subscribe
