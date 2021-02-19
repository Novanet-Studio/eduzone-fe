import { useState } from 'react'
import { getUserLicense } from '@/utils/common'
import { useFormInput } from '@/hooks'

const ManageLicense = () => {
  const userLicense = getUserLicense()
  const accesscode = useFormInput('')
  const licenseType = useFormInput('math')
  const [isAddingCode, setIsAddingCode] = useState(false)

  const handleAddingCode = () => {
    setIsAddingCode(!isAddingCode)
  }

  const handleAccessCode = () => {
    console.log(accesscode.value)
    console.log(licenseType.value)
  }

  return (
    <div className="account__card">
      <div className="account__card-header">
        <h3 className="account__card-title">Manage License</h3>
      </div>
      {userLicense?.type ? (
        <>
          <hr className="account__line" />
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
      ) : (
        <>
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <button
              className="edit__button"
              style={{ marginBottom: '.4rem' }}
              onClick={handleAddingCode}
            >
              Add access code
            </button>
          </div>
          <hr className="account__line" />
          {isAddingCode && (
            <>
              <div>
                <select onChange={licenseType.onChange} value={licenseType.value}>
                  <option value="math">Math package</option>
                  <option value="arts">Language Arts package</option>
                  <option value="combo">Combo package</option>
                </select>
                <input
                  type="text"
                  placeholder="Access Code"
                  value={accesscode.value}
                  onChange={accesscode.onChange}
                />
              </div>
              <button onClick={handleAccessCode}>Add</button>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ManageLicense
