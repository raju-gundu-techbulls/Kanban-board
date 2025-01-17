import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { taskType } from "../Types/types";
import Modal, { ModalHandle } from "./Modal";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskProps {
  task: taskType;
  setTasks: Dispatch<SetStateAction<taskType[]>>;
  tasks: taskType[];
}
export default function Task({ task, setTasks, tasks }: TaskProps) {
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");

  const editTask = useRef<ModalHandle>(null);

  const {
    setNodeRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "taskType",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const handleEditTaskClick = () => {
    editTask.current?.open();
    setNewTitle(task.title);
    setNewDescription(task.description);
    return;
  };
  const handleNewTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleNewDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewDescription(event.target.value);
  };

  const handleEditTaskCancel = () => {
    setNewDescription("");
    setNewTitle("");
    editTask.current?.close();
  };

  const handleEditTaskSave = () => {
    const updatedTasks = tasks.map((t) =>
      t.id === task.id
        ? { ...t, title: newTitle, description: newDescription }
        : t
    );
    setTasks(updatedTasks);
    editTask.current?.close();
  };

  function handleTaskDelete() {
    const updatedTasks = () => tasks.filter((t) => t.id !== task.id);
    setTasks(updatedTasks);
  }
  if (isDragging) {
    return (
      <div
        className="col opacity-50"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
      >
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{task.title}</h5>
            <p className="card-text">{task.description}</p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button className="btn btn-outline-primary me-md-2" type="button">
                Edit
              </button>
              <button className="btn btn-outline-danger" type="button">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Modal ref={editTask}>
        <div className="mb-3">
          <label className="form-label">Enter Task Title</label>
          <input
            type="text"
            className="form-control"
            onChange={handleNewTitleChange}
            value={newTitle}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Enter Task Description</label>
          <input
            type="text"
            className="form-control"
            onChange={handleNewDescriptionChange}
            value={newDescription}
          />
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button
            className="btn btn-outline-danger me-md-2"
            type="button"
            onClick={handleEditTaskCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            type="button"
            onClick={handleEditTaskSave}
          >
            Save
          </button>
        </div>
      </Modal>
      <div
        className="col"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
      >
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{task.title}</h5>
            <p className="card-text">{task.description}</p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                className="btn btn-outline-primary me-md-2"
                type="button"
                onClick={handleEditTaskClick}
              >
                Edit
              </button>
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={handleTaskDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
