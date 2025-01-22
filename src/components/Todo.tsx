import { useEffect, useRef, useState } from 'react'
import todo_icon from '../assets/todo_icon.png'
import Todoitems from './Todoitems'

type Todo = {
    id: Date;
    text: string | undefined;
    isComplete: boolean
}



const Todo = () => {

    const [btn, setBtn] = useState(true);

    const [todolist, setTodoList] = useState<Todo[]>(() => {
        const storedTodos = localStorage.getItem("todos");
        if (storedTodos) {
            try {
                const parsedTodos: Todo[] = JSON.parse(storedTodos);
                return Array.isArray(parsedTodos) ? parsedTodos : [];
            } catch {
                return [];
            }
        }
        return [];
    });


    const [editedText, setEditedTodo] = useState<string>("")

    const inputRef = useRef<HTMLInputElement>(null)

    const add = () => {

        const inputText = inputRef.current?.value.trim()
        if (!inputText) return
        const duplicateTodos = todolist.some((todo) => todo.text === inputText)
        if (duplicateTodos) {
            alert("This todo already exists!");
        return
        }

        const newTodo: Todo = {
            id: new Date(),
            text: inputText,
            isComplete: false
        }
        setTodoList((prev) => {
            const updatedTodos = [...prev, newTodo];

            return updatedTodos;
        });

        setEditedTodo('')
        setBtn(true)
    }

  

    const deleteTodo = (id: Date) => {
        return setTodoList((prevTodo) => prevTodo.filter((todo) => todo.id !== id));
    };

    const toggle = (id: Date) => {
        setTodoList((prevTodo) => {
            return prevTodo.map((todo) => {
                if (todo.id === id) {
                    return { ...todo, isComplete: !todo.isComplete };
                }
                return todo;
            });
        });
    };

    const editTodo = (todo: Todo) => {
        setEditedTodo(todo.text||"");
        deleteTodo(todo.id)
        setBtn(false)
  
    }


    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todolist))
    }, [todolist])

    return (
        <div className="bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl">
            {/* -------title----- */}
            <div className=" flex items-center mt-7 gap-2">
                <img className='w-8 ' src={todo_icon} alt="" />
                <h1 className="text-3xl font-semibold">To-Do List</h1>


            </div>

            {/* -------input-box ----- */}

            <div className='flex items-center my-7 bg-gray-200 rounded-full'>
                <input ref={inputRef} value={editedText} onChange={(e) => setEditedTodo(e.target.value)} className='bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600' type="text" placeholder='Add your task...' />
                {btn ? (

                <button onClick={add} className='border-none rounded-full  bg-orange-400 w-32 h-14 text-white text-lg font-medium cursor-pointer'>ADD +</button>
                ) : (

                <button onClick={add} className='border-none rounded-full  bg-orange-400 w-32 h-14 text-white text-lg font-medium cursor-pointer'>EDIT +</button>
                )}
            </div>

            {/* -------todo list ----- */}

            <div>
                {todolist.map((item, index) => {
                    return <Todoitems key={index} text={item.text} id={item.id} isComplete={item.isComplete} deleteTodo={deleteTodo} toggle={toggle} editTodo={editTodo} />
                })}

            </div>

        </div>
    )
}

export default Todo