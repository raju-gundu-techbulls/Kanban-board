import React, { useMemo, useRef, useState } from "react";
import Task from "./Task";
import { boardType, taskType } from "../Types/types";
import Modal, { ModalHandle } from "./Modal";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  closestCenter,
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";

interface BoardProps {
  board: boardType;
  boards: boardType[];
  setBoards: React.Dispatch<React.SetStateAction<boardType[]>>;
  onDragStart: (event: DragStartEvent) => void;
  setTasks: React.Dispatch<React.SetStateAction<taskType[]>>;
  tasks: taskType[];
  createNewTask: (id: number) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event:DragEndEvent) => void;
  activeTask: taskType | null
}
export default function Board({
  board,
  boards,
  setBoards,
  onDragStart,
  setTasks,
  tasks,
  createNewTask,
  onDragOver,
  onDragEnd,
  activeTask
}: BoardProps) {
  const [boardTitle, setBoardTitle] = useState<string>(board.title);
  const tasksId = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const editBoard = useRef<ModalHandle>(null);

  const {
    setNodeRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: board.id,
    data: {
      type: "boardType",
      board,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  function handleDelete() {
    setBoards(boards.filter((b) => b.id !== board.id));
  }

  const handleEditCancel = () => {
    setBoardTitle("");
    editBoard.current?.close();
  };

  const handleEditSave = () => {
    const updatedBoards = boards.map((b) =>
      b.id === board.id ? { ...b, title: boardTitle } : b
    );
    setBoards(updatedBoards);
    editBoard.current?.close();
  };

  const handleEditClick = () => {
    editBoard.current?.open();
    return;
  };

  const handleBoardTitleUpdate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBoardTitle(event.target.value);
  };

  

  if (isDragging) {
    return (
      <div className="col" ref={setNodeRef} style={style}>
        <div className="card">
          <div className="card-header" {...attributes} {...listeners}>
            <h5 className="">{board.title}</h5>
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                type="button"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => createNewTask(board.id)}
              >
                Add Task
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row row-cols-1 row-cols-md-2 g-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Modal ref={editBoard}>
        <div className="mb-3">
          <label className="form-label">Enter new title</label>
          <input
            type="text"
            className="form-control"
            onChange={handleBoardTitleUpdate}
            value={boardTitle}
          />
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button
            className="btn btn-outline-danger me-md-2"
            type="button"
            onClick={handleEditCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            type="button"
            onClick={handleEditSave}
          >
            Save
          </button>
        </div>
      </Modal>

      <div className="col" ref={setNodeRef} style={style}>
        <div className="card">
          <div className="card-header" {...attributes} {...listeners}>
            <h5>{board.title}</h5>
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                type="button"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => createNewTask(board.id)}
              >
                Add Task
              </button>
            </div>
          </div>
          <div className="card-body">
                <SortableContext items={tasksId}>
              <div className="row row-cols-1 row-cols-md-2 g-4">
                  {tasks.map((task) => {
                    return (
                      <Task
                        key={task.id}
                        task={task}
                        setTasks={setTasks}
                        tasks={tasks}
                      />
                    );
                  })}
              </div>
                </SortableContext>
          </div>
        </div>
      </div>
    </>
  );
}
