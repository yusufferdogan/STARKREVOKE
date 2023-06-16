import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo } from './todoSlice';

export function TodoPage() {
  const [inputValue, setInputValue] = useState('');
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      dispatch(addTodo(inputValue));
      setInputValue('');
    }
  };

  return (
    <div className="m-8 p-5">
      <div className="flex justify-center">
        <input
          className="text-black"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="pl-5" onClick={handleAddTodo}>
          Add Todo
        </button>
      </div>

      <ul className="gap-2">
        {todos.map((todo) => (
          <li key={Date.now()}>{todo.text.actual_fee}</li>
        ))}
      </ul>
    </div>
  );
}
