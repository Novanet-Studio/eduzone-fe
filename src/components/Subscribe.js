import axios from 'axios'
import { useState } from 'react'
import { URL } from '../utils'


export const Subscribe = ({ parentClass = 'hero' }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const currentClass = parentClass === 'hero' 
    ? 'hero__'
    : 'faq__info-'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${URL}/auth/signin`, {
        userName: email,
        password: '',
      })

      console.log(data)

    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = ({ currentTarget }) => 
    setEmail(currentTarget.value)

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
      />
      <button className={`${currentClass}button`} type="submit">
        Subscribe &nbsp;
        {loading ? 'Loading...' : '>'}
      </button>
    </form>
  )
}

export default Subscribe
