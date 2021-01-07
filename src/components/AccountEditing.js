import React, { useState, useRef, useEffect } from 'react'
import { fetchData, URL } from '../utils'
import './AccountEditing.scss'

const initialState = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
}

const AccountEditing = ({ defaults, updateInformation, editing }) => {
  const [formState, setFormState] = useState(initialState)
  const _isMounted = useRef(true)

  useEffect(() => {
    return () => (_isMounted.current = false)
  }, [])

  const handleChange = ({ target: { name, value } }) =>
    setFormState({ ...formState, [name]: value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const defaultLastname = defaults.lastname || ''
    const body = {
      firstname: formState.firstname || defaults.firstname,
      lastname: formState.lastname || defaultLastname,
      userName: formState.email || defaults.userName,
      password: formState.password,
    }

    try {
      if (_isMounted.current) {
        const result = await fetchData(`${URL}/api/auth/update`, 'POST', body)

        console.log(result)

        updateInformation({ ...result.user })
        editing(false)
        setFormState(initialState)
        console.log('data sent')
      }
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