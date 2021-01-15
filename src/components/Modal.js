import './Modal.scss'

const Modal = ({ isOpen, closeModal }) => {
  const handleModalDialogClick = (e) => e.stopPropagation()

  return (
    <section className={`modal ${isOpen && 'modal-open'}`} onClick={closeModal}>
      <div className="modal__dialog" onClick={handleModalDialogClick}>
      <button className="modal__btn-close" onClick={closeModal}>&times;</button>
        <h2 className="modal__title">Thanks for you subscription!</h2>
        <p className="modal__body">
          We have sent you an email with your access credentials for future
          reference.
        </p>
        <div className="modal__info">
          <p className="modal__text">Access now!</p>
          <a href="https://eduzoneserver.com/studentportal/">Click here</a>
        </div>
      </div>
    </section>
  )
}

export default Modal
