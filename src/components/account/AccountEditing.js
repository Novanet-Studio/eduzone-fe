import axios from 'axios'
import { useFormInput } from '../../hooks'
import { getUser, setUserSession } from '../../utils/common'
import { URL } from '../../constants'
import './AccountEditing.scss'

const AccountEditing = ({ editing }) => {
  const current = getUser()
  const firstname = useFormInput('')
  const lastname  = useFormInput('')
  const email  = useFormInput('')
  const password  = useFormInput('')
  // const confirmPassword  = useFormInput('')

  const resetInputs = () => {
    firstname.reset()
    lastname.reset()
    email.reset()
    password.reset()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const defaultLastname = current.lastname || ''
    const bodyRequest = {
      firstname: firstname.value || current.firstname,
      lastname: lastname.value || defaultLastname,
      userName: email.value || current.username,
      password: password.value || null,
    }

    try {
      // if (!_isMounted.current) return

      const { data } = await axios.post(`${URL}/user/update`, bodyRequest)

      // updateInformation({ ...data.user })
      setUserSession(data.user)
      editing(false)
      // setInitialFormState()
      resetInputs()
      console.log('data sent')
    } catch (error) {
      console.log('[EDITING_ACCOUNT]')
      console.error({ error })
      resetInputs()
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
          value={firstname.value}
          placeholder={current.firstname}
          onChange={firstname.onChange}
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
          value={lastname.value}
          placeholder={current.lastname || 'empty'}
          onChange={lastname.onChange}
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
          value={email.value}
          placeholder={current.username}
          onChange={email.onChange}
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
          value={password.value}
          placeholder="•••••••••••"
          onChange={password.onChange}
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
