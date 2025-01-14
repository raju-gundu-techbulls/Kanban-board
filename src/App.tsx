import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Board from './Components/Board';
import { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from 'react';
import Modal from './Components/Modal';
import { ModalHandle } from './Components/Modal';
import { boardType } from './Types/types';


function App() {
  const modal = useRef<ModalHandle>(null)

  function handleClick() {
    modal.current?.open();

    return;
  }

  const [boards, setBoards] = useState<boardType[]>([]);
  const [boardTitle, setBoardTitle] = useState<string>('');
  useEffect(() => {
    const savedBoards = localStorage.getItem('kanbanBoards');
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kanbanBoards', JSON.stringify(boards));
  }, [boards]);




  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBoardTitle(event.target.value);
  };

  const handleSave = () => {
    if (boardTitle.trim()) {
      setBoards([...boards, { id: Date.now(), title: boardTitle, tasks: [] }]);
      setBoardTitle(''); // Clear the input after adding
      modal.current?.close();
    }
  };

  const handleCancel = () => {
    setBoardTitle('');
    modal.current?.close();
  }

  const handleDeleteAllBoards = () => {
    setBoards([]);
  }

  return (
    <>
      <Modal ref={modal}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" onChange={handleTitleChange} value={boardTitle} />
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button className="btn btn-outline-danger me-md-2" type="button" onClick={handleCancel}>Cancel</button>
          <button className="btn btn-success" type="button" onClick={handleSave}>Save</button>
        </div>
      </Modal>

      <div className="container mt-4" >
        <h2 className='text-center'>Kanban Board</h2>
        <div className="container ">
          <div className='d-grid gap-2 d-md-flex justify-content-md-start'>
            <button className="btn btn-secondary btn-lg mb-3" type="button" onClick={handleClick}>Add Board</button>
            {
              boards.length>0 && 
            <button className="btn btn-danger btn-lg mb-3" type="button" onClick={handleDeleteAllBoards}>Delete All</button>
            }
          </div>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {boards.map((board, index) => (
              <div className="col" key={board.id}>
                <Board board={board} setBoards={setBoards} boards={boards} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;


