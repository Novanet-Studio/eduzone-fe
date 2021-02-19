import { getUser, getUserLicense, setUserLicense } from '@/utils/common'
import { useFormInput } from '@/hooks'
import { useState } from 'react'
import axios from 'axios'
import { URL } from '@/constants'

const ManageLicense = ({ showError, loading }) => {
  const user = getUser()
  const userLicense = getUserLicense()
  const accesscode = useFormInput('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAccessCode = async () => {
    setIsAdding(true)
    try {
      await axios.post(`${URL}/user/assigncode`, {
        email: user.username,
        accesscode: accesscode.value,
      })
      const {data:{ license }} = await axios.get(`${URL}/auth/me`)
      loading(true)
      setUserLicense(license)
      setIsAdding(false)
      accesscode.reset()
    } catch (error) {
      console.log({ error })
      loading(true)
      const {data:{ license }} = await axios.get(`${URL}/auth/me`)
      setUserLicense(license)
      accesscode.reset()
      showError(error.message)
      setIsAdding(false)
      loading(false)
    }
  }

  return (
    <div className="account__card">
      <div className="account__card-header">
        <h3 className="account__card-title">Manage License</h3>
      </div>
      <hr className="account__line" />
      {userLicense?.type && (
        <>
          <div>
            <p style={{ fontWeight: 'bold' }}>License Name</p>
            <span className="account__card-data">
              <p>{userLicense.type}</p>
            </span>
          </div>
          <div>
            <p style={{ fontWeight: 'bold' }}>Access code</p>
            <span className="account__card-data">
              <p>{userLicense.accesscode}</p>
            </span>
          </div>
        </>
      )}
      <input
        type="text"
        placeholder="Access Code"
        value={accesscode.value}
        onChange={accesscode.onChange}
      />
      <button onClick={handleAccessCode}>
        {isAdding ? 'Adding...' : 'Add'}
      </button>
    </div>
  )
}

export default ManageLicense
