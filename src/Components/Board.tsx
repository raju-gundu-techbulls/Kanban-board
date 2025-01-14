import React, { useRef, useState } from 'react'
import Task from './Task'
import { boardType } from '../Types/types'
import Modal, { ModalHandle } from './Modal';
import { title } from 'process';
import { DragEndEvent } from '@dnd-kit/core';

interface BoardProps {
    board: boardType;
    index: number;
    boards: boardType[];
    setBoards: React.Dispatch<React.SetStateAction<boardType[]>>;
}
export default function Board({ board, boards, setBoards, index }: BoardProps) {
    const [taskTitle, setTaskTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [boardTitle, setBoardTitle] = useState<string>(board.title);

    const modal = useRef<ModalHandle>(null)
    const editBoard = useRef<ModalHandle>(null);

    function handleDelete() {
        setBoards(boards.filter(b => b.id !== board.id));
    };

    const handleTaskTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(event.target.value);
    };

    const handleTaskDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const handleCancel = () => {
        setTaskTitle('');
        modal.current?.close();
    }
    const handleAddTask = () => {
        modal.current?.open();
        return;
    }

    const handleSave = () => {
        if (taskTitle.trim()) {
            const updatedBoards = boards.map(b =>
                b.id === board.id ? { ...b, tasks: [...b.tasks, { id: Date.now(), title: taskTitle, description: description }] } : b);
            setBoards(updatedBoards);
            setTaskTitle('');
            setDescription('');
            modal.current?.close();

        }
    };

    const handleEditCancel = () => {
        setBoardTitle('');
        editBoard.current?.close();
    }

    const handleEditSave = () => {
        const updatedBoards = boards.map(b =>
            b.id === board.id ? { ...b, title: boardTitle } : b
        );
        setBoards(updatedBoards);
        editBoard.current?.close();
    };

    const handleEditClick = () => {
        editBoard.current?.open();
        return;
    }

    const handleBoardTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBoardTitle(event.target.value);
    }

    const moveBoard = (direction: 'left' | 'right') => {
        const newIndex = direction === 'left' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex > boards.length) return;
        const updatedBoards = [...boards];
        [updatedBoards[index], updatedBoards[newIndex]] = [updatedBoards[newIndex], updatedBoards[index]];
        setBoards(updatedBoards);
    }

    
    return (
        <>
            <Modal ref={modal}>
                <div className="mb-3">
                    <label className="form-label">Enter Task Title</label>
                    <input type="text" className="form-control" onChange={handleTaskTitleChange} value={taskTitle} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Enter Task Description</label>
                    <input type="text" className="form-control" onChange={handleTaskDescriptionChange} value={description} />
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button className="btn btn-outline-danger me-md-2" type="button" onClick={handleCancel}>Cancel</button>
                    <button className="btn btn-success" type="button" onClick={handleSave}>Save</button>
                </div>
            </Modal>
            <Modal ref={editBoard}>
                <div className="mb-3">
                    <label className="form-label">Enter new title</label>
                    <input type="text" className="form-control" onChange={handleBoardTitleUpdate} value={boardTitle} />
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button className="btn btn-outline-danger me-md-2" type="button" onClick={handleEditCancel}>Cancel</button>
                    <button className="btn btn-success" type="button" onClick={handleEditSave}>Save</button>
                </div>
            </Modal>

            <div className="col" >
                <div className="card">
                    <div className="card-header">
                        <h5 >{board.title}</h5>
                        <div className=''>
                            <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => moveBoard('left')} disabled={index === 0}>&lt;</button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => moveBoard('right')} disabled={index === boards.length - 1}>&gt;</button>
                        </div>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button className="btn btn-primary" type="button" onClick={handleEditClick}>Edit</button>
                            <button className="btn btn-danger" type="button" onClick={handleDelete}>Delete</button>
                            <button className="btn btn-secondary" type="button" onClick={handleAddTask}>Add Task</button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                            {board.tasks.map((task) => {
                                return (
                                    <Task
                                        key={task.id}
                                        task={task}
                                        boardId={board.id}
                                        boards={boards}
                                        setBoards={setBoards}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
