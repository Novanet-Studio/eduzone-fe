import './Modal.scss'

const Modal = ({ isOpen, closeModal }) => {
  const handleModalDialogClick = (e) => e.stopPropagation()

  return (
    <section className={`modal ${isOpen && 'modal-open'}`} onClick={closeModal}>
      <div className="modal__info" onClick={handleModalDialogClick}>
        <div className="modal__head">
          <button
            onClick={closeModal}
            className="button modal__button modal__button-red"
          >
            <span>&#10006;</span>
          </button>
        </div>
        <h2 className="modal__title">¡Thanks for you subscription!</h2>
        <p className="modal__text">
          We have sent you an email with your access credentials for future
          reference.
        </p>
        <button className="button modal__button modal__button-blue">
          <a href="https://www.eduzoneserver.com/" target="_blank" rel="noreferrer">
            Access now
          </a>
        </button>
      </div>
    </section>
  )
}

export default Modal
