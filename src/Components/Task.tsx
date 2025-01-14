import React, { useRef, useState } from 'react'
import { boardType, taskType } from '../Types/types'
import Modal, { ModalHandle } from './Modal';
import { title } from 'process';

interface TaskProps {
    task: taskType;
    boardId: number;
    boards: boardType[];
    setBoards: React.Dispatch<React.SetStateAction<boardType[]>>
}
export default function Task({ task, boardId, boards, setBoards }: TaskProps) {

    const [newTitle,setNewTitle] = useState<string>('');
    const [newDescription,setNewDescription] = useState<string>('');
    
    const editTask = useRef<ModalHandle>(null);

    const handleEditTaskClick = ()=>{
        editTask.current?.open();
        setNewTitle(task.title);
        setNewDescription(task.description);
        return;
    }
    const handleNewTitleChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
        setNewTitle(event.target.value);
    }

    const handleNewDescriptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setNewDescription(event.target.value);
    }

    const handleEditTaskCancel = ()=>{
        setNewDescription('');
        setNewTitle('');
        editTask.current?.close();
    }

    const handleEditTaskSave = () => {
        const updatedBoards = boards.map((b)=>
        b.id===boardId?{
            ...b,tasks: b.tasks.map((t)=>t.id===task.id?{...task,title:newTitle,description:newDescription}:task),
        }:b);

        setBoards(updatedBoards)
        editTask.current?.close();
    }

    function handleTaskDelete() {
        setBoards((prevBoards) => prevBoards.map(
            (board) => board.id === boardId ? {
                ...board, tasks: board.tasks.filter((t) => t.id !== task.id)
            } : board
        ))
    }


    return (
        <>
            <Modal ref={editTask}>
                <div className="mb-3">
                    <label className="form-label">Enter Task Title</label>
                    <input type="text" className="form-control" onChange={handleNewTitleChange} value={newTitle} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Enter Task Description</label>
                    <input type="text" className="form-control" onChange={handleNewDescriptionChange} value={newDescription} />
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button className="btn btn-outline-danger me-md-2" type="button" onClick={handleEditTaskCancel}>Cancel</button>
                    <button className="btn btn-success" type="button" onClick={handleEditTaskSave}>Save</button>
                </div>
            </Modal>
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{task.title}</h5>
                        <p className="card-text">{task.description}</p>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button className="btn btn-outline-primary me-md-2" type="button" onClick={handleEditTaskClick}>Edit</button>
                            <button className="btn btn-outline-danger" type="button" onClick={handleTaskDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
