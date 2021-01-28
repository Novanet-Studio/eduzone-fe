import './Modal.scss'

const Modal = ({ isOpen, closeModal }) => {
  const handleModalDialogClick = (e) => e.stopPropagation()

  return (
    <section className={`modal ${isOpen && 'modal-open'}`} onClick={closeModal}>
      <div className="modal__info" onClick={handleModalDialogClick}>
        <h2 className="modal__title">Thanks for you subscription!</h2>
        <p className="modal__text">
          We have sent you an email with your access credentials for future
          reference.
        </p>
        <div className="modal__cta">
          <button className="modal__button modal__button-blue">
            <a href="https://www.eduzoneserver.com/">Access now</a>
          </button>
          <button onClick={closeModal} className="modal__button modal__button-red">
            Close
          </button>
        </div>
      </div>
    </section>
  )
}

export default Modal
