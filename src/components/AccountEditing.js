import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import { URL } from '../utils'
import './AccountEditing.scss'


const AccountEditing = ({ defaults, updateInformation, editing }) => {
  const [formState, setFormState] = useState({})
  const _isMounted = useRef(true)

  useEffect(() => {
    return () => (_isMounted.current = false)
  }, [])

  const handleChange = ({ target: { name, value } }) =>
    setFormState({ ...formState, [name]: value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const defaultLastname = defaults.lastname || ''
    const bodyRequest = {
      firstname: formState.firstname || defaults.firstname,
      lastname: formState.lastname || defaultLastname,
      userName: formState.email || defaults.username,
      password: formState.password,
    }

    try {
      if (!_isMounted.current) return
      
      const { data } = await axios.post(`${URL}/user/update`, bodyRequest)

      updateInformation({ ...data.user })
      editing(false)
      setFormState({})
      console.log('data sent')
    } catch (e) {
      throw new TypeError(e)
    }
  }

  return (
    <form className="edit__form" onSubmit={handleSubmit}>
      <div className="edit__form-group">
        <label className="edit__form-label" htmlFor="firstname">
          First Name
        </label>
        <input
          className="edit__form-input"
          type="text"
          name="firstname"
          value={formState.firstname}
          placeholder={defaults.firstname}
          onChange={handleChange}
        />
      </div>
      <div className="edit__form-group">
        <label className="edit__form-label" htmlFor="lastname">
          Last Name
        </label>
        <input
          className="edit__form-input"
          type="text"
          name="lastname"
          value={formState.lastname}
          placeholder={defaults.lastname || 'empty'}
          onChange={handleChange}
        />
      </div>
      <div className="edit__form-group">
        <label className="edit__form-label" htmlFor="email">
          Email
        </label>
        <input
          className="edit__form-input"
          type="email"
          name="email"
          value={formState.email}
          placeholder={defaults.userName}
          onChange={handleChange}
        />
      </div>
      <div className="edit__form-group">
        <label className="edit__form-label" htmlFor="password">
          Password
        </label>
        <input
          className="edit__form-input"
          type="password"
          name="password"
          value={formState.password}
          placeholder="••••••••••••"
          onChange={handleChange}
        />
      </div>
      <button className="edit__button-update" type="submit">
        Update info
      </button>
    </form>
  )
}

export default AccountEditing
