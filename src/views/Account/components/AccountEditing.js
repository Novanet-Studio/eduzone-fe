import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import Modal from '@/components/Modal'
import { useModal } from '@/hooks'
import { URL } from '@constants'
import { getUser, setUserSession } from '@utils/common'
import { ErrorMessage } from '@hookform/error-message'
import { ErrorMessageContainer } from '@/components/ErrorMessage'
import './AccountEditing.scss'

const AccountEditing = ({ setEditing }) => {
  const user = getUser()
  const [formData, setFormData] = useState(null)
  const [isOpenModal, openModal, closeModal] = useModal()
  const { register, handleSubmit, errors } = useForm({ mode: 'onChange' })

  const handleSubmitForm = (data) => {
    const firstname = data.firstname || user.firstname
    const lastname = data.lastname || user.lastname
    const email = data.email || user.username

    const hasFieldsData =
      data.firstname || data.lastname || data.email || data.password

    if (hasFieldsData) {
      setFormData({
        firstname,
        lastname,
        userName: email,
        password: data.password,
      })
      openModal()
      return
    }
  }

  const handleConfirmPasswordForm = async ({ confirmPassword }) => {
    let password = ''
    const signinParams = {
      userName: user.username,
      password: confirmPassword,
    }

    try {
      const { data } = await axios.post(`${URL}/auth/signin`, signinParams)

      if (!data) {
        throw new Error('Password not valid')
      }

      if (!formData.password) {
        password = confirmPassword
      }

      try {
        const { data } = await axios.post(`${URL}/user/update`, { ...formData, password })

        setUserSession(data.user)
        setEditing(false)
        closeModal()
      } catch (error) {
        console.log('[EDITING_ACCOUNT]')
        console.error({ error })
        throw new TypeError('There was an error')
      }

    } catch (error) {
      console.log({ error })
      throw new Error('There was an error while confirm user password')
    }
  }

  return (
    <>
      <Modal isOpen={isOpenModal} closeModal={closeModal}>
        <form onSubmit={handleSubmit(handleConfirmPasswordForm)}>
          <div className="edit__form-group">
            <label className="edit__form-label" htmlFor="firstname">
              Confirm password
            </label>
            <input
              className="edit__form-input"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              ref={register({
                minLength: {
                  value: 6,
                  message: 'Your password must be at least 6 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'The password must be between 6 and 20 characters',
                },
              })}
            />
            <ErrorMessage
              errors={errors}
              name="confirmPassword"
              as={<ErrorMessageContainer />}
            />
          </div>
          <button className="edit__button-update" type="submit">
            confirm
          </button>
        </form>
      </Modal>
      <form className="edit__form" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="edit__form-group">
          <label className="edit__form-label" htmlFor="firstname">
            First Name
          </label>
          <input
            className="edit__form-input"
            type="text"
            name="firstname"
            placeholder={user.firstname}
            ref={register()}
          />
          <ErrorMessage
            errors={errors}
            name="firstname"
            as={<ErrorMessageContainer />}
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
            placeholder={user.lastname}
            ref={register()}
          />
          <ErrorMessage
            errors={errors}
            name="lastname"
            as={<ErrorMessageContainer />}
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
            placeholder={user.username}
            ref={register({
              pattern: {
                value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                message: 'Email not valid',
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="email"
            as={<ErrorMessageContainer />}
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
            placeholder="•••••••••••"
            ref={register({
              minLength: {
                value: 6,
                message: 'Your password must be at least 6 characters',
              },
              maxLength: {
                value: 20,
                message: 'The password must be between 6 and 20 characters',
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="password"
            as={<ErrorMessageContainer />}
          />
        </div>
        <button className="edit__button-update" type="submit">
          Update info
        </button>
      </form>
    </>
  )
}

export default AccountEditing
