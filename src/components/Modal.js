import './Modal.scss'

const Modal = ({ isOpen, closeModal, children }) => {
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
        {children}
      </div>
    </section>
  )
}

export default Modal
