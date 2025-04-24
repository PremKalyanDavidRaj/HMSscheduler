import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const codes = [
  { id: '99213', description: 'Office visit (established patient)' },
  { id: '99214', description: 'Detailed office visit (established patient)' }
];

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4
};

export default function MedicalCodeDnD({ onSelectCode }) {
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const code = codes[result.source.index];
    setSelectedCodes((prev) => [...prev, code]);
    onSelectCode([...selectedCodes, code]);
  };

  const handleCodeClick = async (code) => {
    setIsLoading(true);
    setModalOpen(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/medical-code-details/${code.id}`);
      setActiveCode(res.data);
    } catch (err) {
      setActiveCode({ code: code.id, shortDesc: 'Error', aiDesc: 'Unable to fetch details.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="available">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <Typography variant="h6">Available Codes</Typography>
              {codes.map((code, index) => (
                <Draggable key={code.id} draggableId={code.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => handleCodeClick(code)}
                      style={{ padding: 8, margin: '8px 0', background: '#eee', cursor: 'pointer' }}
                    >
                      {code.id} - {code.description}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Code Info</Typography>
            <IconButton onClick={() => setModalOpen(false)}><CloseIcon /></IconButton>
          </Box>
          {isLoading ? <Typography>Loading...</Typography> : (
            <>
              <Typography variant="body1"><strong>{activeCode?.code}</strong></Typography>
              <Typography variant="body2"><strong>Short:</strong> {activeCode?.shortDesc}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}><strong>Details:</strong> {activeCode?.aiDesc}</Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
