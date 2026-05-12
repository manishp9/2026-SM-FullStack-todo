import { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Plus,
  Search,
  Calendar,
  Trash2,
  CheckCircle2,
  Circle,
  Star,
  X,
} from "lucide-react";

// ✅ Fix #1: Interface moved outside component (was redefined on every render)
interface Task {
  _id: string;
  title: string;
  completed: boolean;
  priority: string;
  date: Date | null;
  starred: boolean;
}

// ✅ Fix #13: Moved outside component so it's never recreated on render
const getDateStatus = (taskDate: Date | null, taskCompleted: boolean) => {
  // ✅ Fix #7: Null guard for date
  if (!taskDate) {
    return { text: "No date", className: "bg-zinc-800 text-zinc-400" };
  }

  const today = new Date();
  const date = new Date(taskDate);

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (taskCompleted) {
    return {
      text: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      className: "bg-zinc-800 text-zinc-300",
    };
  }

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0)
    return { text: "Today", className: "bg-red-500/10 text-red-400" };
  if (diffDays === 1)
    return { text: "Tomorrow", className: "bg-yellow-500/10 text-yellow-400" };
  if (diffDays === -1)
    return { text: "Yesterday", className: "bg-red-500/10 text-red-400" };
  if (diffDays > 1 && diffDays <= 5)
    return {
      text: `${diffDays} days left`,
      className: "bg-yellow-500/10 text-yellow-400",
    };
  if (diffDays < 0)
    return {
      text: `${Math.abs(diffDays)} days ago`,
      className: "bg-red-500/10 text-red-400",
    };

  return {
    text: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    className: "bg-zinc-800 text-zinc-300",
  };
};

const DEFAULT_CREATE_TASK = {
  title: "",
  priority: "",
  starred: false,
};

export default function TodoAppUI() {
  const [tasks, setTask] = useState<Task[]>([]);
  const [taskTab, setTaskTab] = useState("all tasks");
  const [newTaskBtn, setNewTaskBtn] = useState(false);
  const [searchTask, setSearchTask] = useState("");
  const [dateOrder, setDateOrder] = useState("asc");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [createTask, setCreateTask] = useState(DEFAULT_CREATE_TASK);

  // ✅ Fix #2: Fetch only on mount, not on every createTask change
  useEffect(() => {
    fetchTodos();
  }, []);

  const completedTask = tasks.filter((task) => task.completed);
  const totalTask = tasks;
  const pendingTask = tasks.filter((task) => !task.completed);
  const importantTask = tasks.filter((task) => task.starred);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:3000/todo-list");
      const data = await response.json();
      setTask(data.todo);
    } catch (error) {
      console.log(`FetchTodos Message: ${error}`);
    }
  };

  const createTodo = async () => {
    if (!createTask.title.trim()) return;
    try {
      const response = await fetch("http://localhost:3000/todo-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: createTask.title,
          priority: createTask.priority || "low",
          date: startDate,
          starred: createTask.starred,
        }),
      });
      const data = await response.json();
      setTask((prevTasks) => [...prevTasks, data.todo]);

      // ✅ Fix #10 & #11: Reset form and close modal after submit
      setCreateTask(DEFAULT_CREATE_TASK);
      setStartDate(null);
      setNewTaskBtn(false);
    } catch (error) {
      console.log(`CreateTodo Message: ${error}`);
    }
  };

  // ✅ Fix #3: Toggle complete handler
  const toggleComplete = useCallback(
    async (taskId: string, currentState: boolean) => {
      try {
        await fetch(`http://localhost:3000/todo-list/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !currentState }),
        });
        setTask((prev) =>
          prev.map((t) =>
            t._id === taskId ? { ...t, completed: !currentState } : t,
          ),
        );
      } catch (error) {
        console.log(`ToggleComplete Message: ${error}`);
      }
    },
    [],
  );

  // ✅ Fix #3: Delete handler
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await fetch(`http://localhost:3000/todo-list/${taskId}`, {
        method: "DELETE",
      });
      setTask((prev) => prev.filter((t) => t._id !== taskId));
    } catch (error) {
      console.log(`DeleteTask Message: ${error}`);
    }
  }, []);

  // ✅ Fix #4: Star toggle handler
  const toggleStar = useCallback(
    async (taskId: string, currentState: boolean) => {
      try {
        await fetch(`http://localhost:3000/todo-list/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ starred: !currentState }),
        });
        setTask((prev) =>
          prev.map((t) =>
            t._id === taskId ? { ...t, starred: !currentState } : t,
          ),
        );
      } catch (error) {
        console.log(`ToggleStar Message: ${error}`);
      }
    },
    [],
  );

  // ✅ Fix #5: Removed `createTask` from deps (it was unused inside the memo)
  const filterTasks = useMemo(() => {
    let filtered = [...tasks];

    if (taskTab === "completed") filtered = completedTask;
    if (taskTab === "important") filtered = importantTask;
    if (taskTab === "pending") filtered = pendingTask;

    if (taskTab === "date") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date ?? 0);
        const dateB = new Date(b.date ?? 0);
        return dateOrder === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });
    }

    if (searchTask.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchTask.toLowerCase()),
      );
    }

    return filtered;
  }, [tasks, taskTab, searchTask, dateOrder]); // ✅ Fix #5: no createTask here

  // ✅ Fix #12: Safe progress percentage (no division by zero)
  const progressPercent = totalTask.length
    ? Math.round((completedTask.length / totalTask.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 h-fit">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-orange-500 flex items-center justify-center font-bold text-lg">
              T
            </div>
            <div>
              <h1 className="font-bold text-xl">TaskFlow</h1>
              <p className="text-zinc-400 text-sm">Manage your day</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { label: "All Tasks", value: "all tasks", icon: "📋" },
              { label: "Important", value: "important", icon: "⭐" },
              { label: "Completed", value: "completed", icon: "✅" },
              { label: "Pending", value: "pending", icon: "❗️" },
            ].map(({ label, value, icon }) => (
              <button
                key={value}
                onClick={() => setTaskTab(value)}
                className={`w-full h-12 rounded-2xl transition flex items-center px-4 gap-3 ${
                  taskTab === value
                    ? "bg-orange-500 text-white"
                    : "hover:bg-zinc-800 text-zinc-300 cursor-pointer"
                }`}
              >
                <span className="min-w-5">{icon}</span> {label}
              </button>
            ))}

            {/* ✅ Fix #6: Tab and sort order are now separate concerns */}
            <button
              onClick={() => setTaskTab("date")}
              className={`w-full h-12 rounded-2xl transition flex items-center justify-between px-4 gap-3 ${
                taskTab === "date"
                  ? "bg-orange-500 text-white"
                  : "hover:bg-zinc-800 text-zinc-300 cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="min-w-5">📅</span> Due Date
              </div>
              {taskTab === "date" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  }}
                  className="text-xs bg-white/10 px-2 py-0.5 rounded-full hover:bg-white/20 transition"
                >
                  {dateOrder === "asc" ? "↑ Oldest" : "↓ Newest"}
                </button>
              )}
            </button>
          </div>

          <div className="mt-10 bg-zinc-950 rounded-2xl p-5 border border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Progress</h3>
              {/* ✅ Fix #12: Safe progress percent */}
              <span className="text-sm text-orange-500">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-zinc-400 mt-3">
              {completedTask.length} tasks completed from {totalTask.length}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold">My Tasks</h2>
                <p className="text-zinc-400 mt-1">
                  Stay organized and productive
                </p>
              </div>
              <button
                onClick={() => setNewTaskBtn(!newTaskBtn)}
                className="w-fit cursor-pointer h-12 rounded-2xl transition-all hover:scale-105 bg-orange-500 text-white font-medium flex items-center px-4 gap-3"
              >
                <Plus size={18} />
                Add New Task
              </button>
            </div>
          </div>

          {/* Modal */}
          {newTaskBtn && (
            <div
              onClick={() => setNewTaskBtn(false)}
              className="fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center p-5 bg-black/60"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 min-w-[500px] flex flex-col gap-4"
              >
                <button
                  onClick={() => setNewTaskBtn(false)}
                  type="button"
                  className="self-end cursor-pointer"
                >
                  <X size={24} />
                </button>

                <input
                  value={createTask.title}
                  onChange={(e) =>
                    setCreateTask({ ...createTask, title: e.target.value })
                  }
                  type="text"
                  placeholder="Write your next task..."
                  className="h-12 px-4 rounded-2xl bg-zinc-950 border border-zinc-800 outline-none focus:border-orange-500"
                />

                {/* ✅ Fix #8: Priority placeholder is disabled and has empty value */}
                <select
                  value={createTask.priority}
                  onChange={(e) =>
                    setCreateTask({ ...createTask, priority: e.target.value })
                  }
                  className="h-12 px-4 rounded-2xl bg-zinc-950 border border-zinc-800 outline-none"
                >
                  <option value="" disabled>
                    Priority
                  </option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd MMM yyyy"
                  placeholderText="Select Date"
                  className="w-full h-12 px-4 rounded-2xl bg-zinc-950 border border-zinc-800 outline-none focus:border-orange-500"
                />

                {/* ✅ Fix #9: Starred toggle in create form */}
                <button
                  type="button"
                  onClick={() =>
                    setCreateTask({
                      ...createTask,
                      starred: !createTask.starred,
                    })
                  }
                  className={`h-12 px-4 rounded-2xl border flex items-center gap-3 transition ${
                    createTask.starred
                      ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                      : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-yellow-500"
                  }`}
                >
                  <Star
                    size={18}
                    className={
                      createTask.starred
                        ? "fill-yellow-400 text-yellow-400"
                        : ""
                    }
                  />
                  {createTask.starred
                    ? "Marked as Important"
                    : "Mark as Important"}
                </button>

                <button
                  onClick={createTodo}
                  disabled={!createTask.title.trim()}
                  className="h-12 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
                >
                  Add Task
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                label: "Total Tasks",
                value: totalTask.length,
                color: "text-white",
              },
              {
                label: "Completed",
                value: completedTask.length,
                color: "text-green-500",
              },
              {
                label: "Pending",
                value: pendingTask.length,
                color: "text-yellow-500",
              },
              {
                label: "Important",
                value: importantTask.length,
                color: "text-orange-500",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5"
              >
                <p className="text-zinc-400 text-sm">{label}</p>
                <h3 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h3>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              value={searchTask}
              onChange={(e) => setSearchTask(e.target.value)}
              type="text"
              placeholder="Search tasks..."
              className="h-12 w-full pl-11 pr-4 rounded-2xl bg-zinc-950 border border-zinc-800 outline-none focus:border-orange-500"
            />
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filterTasks.length > 0 ? (
              filterTasks.map((task) => {
                const dateInfo = getDateStatus(task.date, task.completed);
                return (
                  <div
                    key={task._id}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-orange-500/40 transition"
                  >
                    <div className="flex items-start gap-4">
                      {/* ✅ Fix #3: Toggle complete onClick */}
                      <button
                        onClick={() => toggleComplete(task._id, task.completed)}
                        className="mt-1 cursor-pointer"
                        aria-label={
                          task.completed ? "Mark incomplete" : "Mark complete"
                        }
                      >
                        {task.completed ? (
                          <CheckCircle2 className="text-green-500" size={24} />
                        ) : (
                          <Circle
                            className="text-zinc-500 hover:text-green-500 transition"
                            size={24}
                          />
                        )}
                      </button>

                      <div>
                        <h3
                          className={`font-medium text-lg ${
                            task.completed ? "line-through text-zinc-500" : ""
                          }`}
                        >
                          {task.title}
                        </h3>

                        <div className="flex flex-wrap gap-3 mt-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              task.priority === "low"
                                ? "bg-gray-500/10 text-gray-400"
                                : task.priority === "medium"
                                  ? "bg-orange-500/10 text-orange-400"
                                  : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)}
                          </span>

                          {/* ✅ Fix #14: Removed custom CSS class names, pure Tailwind only */}
                          <span
                            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${dateInfo.className}`}
                          >
                            <Calendar size={14} />
                            {dateInfo.text}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* ✅ Fix #4: Star toggle onClick */}
                      <button
                        onClick={() => toggleStar(task._id, task.starred)}
                        className="w-11 h-11 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center hover:border-yellow-500 transition cursor-pointer"
                        aria-label={task.starred ? "Unstar task" : "Star task"}
                      >
                        <Star
                          size={18}
                          className={
                            task.starred
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-zinc-400"
                          }
                        />
                      </button>

                      {/* ✅ Fix #3: Delete onClick */}
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="w-11 h-11 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center hover:border-red-500 transition cursor-pointer"
                        aria-label="Delete task"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center text-zinc-500">
                No tasks found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
