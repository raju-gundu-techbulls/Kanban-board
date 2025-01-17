import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Board from "./Components/Board";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Modal from "./Components/Modal";
import { ModalHandle } from "./Components/Modal";
import { boardType, taskType } from "./Types/types";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Task from "./Components/Task";

function App() {
  const modal = useRef<ModalHandle>(null);

  function handleClick() {
    modal.current?.open();

    return;
  }

  const [boards, setBoards] = useState<boardType[]>([]);
  const [boardTitle, setBoardTitle] = useState<string>("");
  const boardsId = useMemo(() => boards.map((board) => board.id), [boards]);
  const [activeBoard, setActiveBoard] = useState<boardType | null>(null);
  const [activeTask, setActiveTask] = useState<taskType | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [boardID, setBoardID] = useState<number>(-1);
  const taskModal = useRef<ModalHandle>(null);
  const [tasks, setTasks] = useState<taskType[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );
  useEffect(() => {
    const savedBoards = localStorage.getItem("kanbanBoards");
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kanbanBoards", JSON.stringify(boards));
  }, [boards]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBoardTitle(event.target.value);
  };

  const handleSave = () => {
    if (boardTitle.trim()) {
      setBoards([...boards, { id: Date.now(), title: boardTitle }]);
      setBoardTitle(""); 
      modal.current?.close();
    }
  };

  const handleCancel = () => {
    setBoardTitle("");
    modal.current?.close();
  };

  const handleDeleteAllBoards = () => {
    setBoards([]);
  };

  const handleTaskCancel = () => {
    setTaskTitle("");
    setDescription("");
    taskModal.current?.close();
  };
  const handleAddTask = (id: number) => {
    setBoardID(id);
    taskModal.current?.open();
    return;
  };

  const handleTaskSave = () => {
    if (taskTitle.trim()) {
      const newTask: taskType = {
        id: Date.now(),
        title: taskTitle,
        description: description,
        boardId: boardID,
      };
      
      setTasks([...tasks, newTask]);
      setTaskTitle("");
      setDescription("");
      taskModal.current?.close();
    }
  };

  const handleTaskTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTaskTitle(event.target.value);
  };

  const handleTaskDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleDragStart = (event: DragStartEvent) => {
    console.log("Drag start", event);
    if (event.active.data.current?.type === "boardType") {
      setActiveBoard(event.active.data.current.board);
    }

    if (event.active.data.current?.type === "taskType") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("drag end", event)
    setActiveBoard(null)
    setActiveTask(null)
    const { active, over } = event;
    if (!over) return;

    const activeBoardId = active.id as number;
    const overBoardId = over.id as number;

    if (activeBoardId === overBoardId) return;
    setBoards((boards) => {
      const activeBoardIndex = boards.findIndex(
        (board) => board.id === activeBoardId
      );
      const overBoardIndex = boards.findIndex(
        (board) => board.id === overBoardId
      );

      return arrayMove(boards, activeBoardIndex, overBoardIndex);
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    console.log("drag over",event)

    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id as number;
    const overId = over.id as number;
    
    if(activeTaskId===overId) return;

    const isActiveTask = active.data.current?.type==="taskType"
    const isOverATask = active.data.current?.type==="taskType"

    if(isActiveTask && isOverATask){
      setTasks(tasks => {

        const activeIndex = tasks.findIndex(t=>t.id===activeTaskId)
        const overIndex = tasks.findIndex(t=>t.id===overId)

        return arrayMove(tasks,activeIndex,overIndex)
      })
    }

    const isOverAboard = over.data.current?.type==="boardType"

    if(isActiveTask && isOverAboard){
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t=>t.id===activeTaskId)
        tasks[activeIndex].boardId = overId
        return arrayMove(tasks,activeIndex,activeIndex)
      })
    }
    
    
  };

  return (
    <>
      <Modal ref={modal}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            onChange={handleTitleChange}
            value={boardTitle}
          />
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button
            className="btn btn-outline-danger me-md-2"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            type="button"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </Modal>
      <Modal ref={taskModal}>
        <div className="mb-3">
          <label className="form-label">Enter Task Title</label>
          <input
            type="text"
            className="form-control"
            onChange={handleTaskTitleChange}
            value={taskTitle}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Enter Task Description</label>
          <input
            type="text"
            className="form-control"
            onChange={handleTaskDescriptionChange}
            value={description}
          />
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button
            className="btn btn-outline-danger me-md-2"
            type="button"
            onClick={handleTaskCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            type="button"
            onClick={handleTaskSave}
          >
            Save
          </button>
        </div>
      </Modal>

      <div className="container mt-4">
        <h2 className="text-center">Kanban Board</h2>
        <div className="container ">
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <button
              className="btn btn-secondary btn-lg mb-3"
              type="button"
              onClick={handleClick}
            >
              Add Board
            </button>
            {boards.length > 0 && (
              <button
                className="btn btn-danger btn-lg mb-3"
                type="button"
                onClick={handleDeleteAllBoards}
              >
                Delete All
              </button>
            )}
          </div>
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            sensors={sensors}
          >
            <div className="row row-cols-1 row-cols-md-3 g-4">
              <SortableContext items={boardsId}>
                {boards.map((board) => (
                  <div className="col" key={board.id}>
                    <Board
                      board={board}
                      setBoards={setBoards}
                      boards={boards}
                      onDragStart={handleDragStart}
                      setTasks={setTasks}
                      tasks={tasks.filter((task) => task.boardId === board.id)}
                      createNewTask={handleAddTask}
                      onDragOver={handleDragOver}
                      onDragEnd = {handleDragEnd}
                      activeTask={activeTask}
                    />
                  </div>
                ))}
              </SortableContext>
            </div>
            {createPortal(
              <DragOverlay>
                {activeBoard && (
                  <Board
                    board={activeBoard}
                    setBoards={setBoards}
                    boards={boards}
                    onDragStart={handleDragStart}
                    setTasks={setTasks}
                    tasks={tasks.filter(
                      (task) => task.boardId === activeBoard.id
                    )}
                    createNewTask={handleAddTask}
                    onDragOver={handleDragOver}
                    onDragEnd = {handleDragEnd}
                    activeTask={activeTask}
                  ></Board>
                )}
                {activeTask && (
                  <Task setTasks={setTasks} tasks={tasks} task={activeTask} />
                )}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>
      </div>
    </>
  );
}

export default App;
