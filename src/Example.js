import Modal from './components/Modal'
import useModal from './hooks/useModal'

export default function Example() {
  const [isOpen, openModal, closeModal] = useModal(false)
  return (
    <>
      <button onClick={openModal}>Abrir</button>
      <Modal isOpen={isOpen} closeModal={closeModal} />
    </>
  )
}