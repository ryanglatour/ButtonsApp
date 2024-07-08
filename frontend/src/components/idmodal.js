import { useExperiment } from '../context/experimentContext'
import React, { useState} from 'react'
import Modal from 'react-modal'

const IDModal = () => {
    const { id, setId, enterId} = useExperiment()
    const [localid, setLocalId] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        setId(localid)

      }
    
    return (
        <Modal
      isOpen={id == null}
      onRequestClose={() => {}}
      contentLabel="ID Modal"
      ariaHideApp={false}
      overlayClassName="modalOverlay"
      className="modalContent"
    >
      <div className="modalHeader">
        <h2>Enter ID</h2>
      </div>
      <form onSubmit={handleSubmit} className="modalForm">
        <label>
          <input
            type="text"
            value={localid}
            onChange={(e) => setLocalId(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </Modal>
    )
}

export default IDModal