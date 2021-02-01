import axios from 'axios'
import { useRef, useEffect } from 'react'

import { useGlobal } from '../context/globalContext'
import { URL } from '../constants'
import './AccountEditing.scss'

const AccountEditing = ({ defaults, updateInformation, editing }) => {
  const { formState, updateFormState, setInitialFormState } = useGlobal()
  const _isMounted = useRef(true)

  useEffect(() => {
    return () => (_isMounted.current = false)
  }, [])

  const handleChange = ({ currentTarget: { name, value } }) =>
    updateFormState({ [name]: value })

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
      setInitialFormState()
      console.log('data sent')
    } catch (error) {
      console.log('[EDITING_ACCOUNT]')
      console.error({ error })
      throw new TypeError(error)
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
      <div className="edit__form-group edit__group-full">
        <label className="edit__form-label" htmlFor="email">
          Email
        </label>
        <input
          className="edit__form-input"
          type="email"
          name="email"
          value={formState.email}
          placeholder={defaults.username}
          onChange={handleChange}
        />
      </div>
      <div className="edit__form-group edit__group-full">
        <label className="edit__form-label" htmlFor="password">
          Password
        </label>
        <input
          className="edit__form-input"
          type="password"
          name="password"
          value={formState.password}
          placeholder="•••••••••••"
          onChange={handleChange}
        />
        <p className="edit__text-down">
          The password must be at least 6 characters. The password must be
          between 6 and 20 characters
        </p>
      </div>
      <button className="edit__button-update" type="submit">
        Update info
      </button>
    </form>
  )
}

export default AccountEditing
