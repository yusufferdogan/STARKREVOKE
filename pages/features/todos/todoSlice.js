import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      const { text, id } = action.payload;
      const idExists = state.some((todo) => todo.id === id);
      if (idExists) return;

      const newTodo = {
        id: id,
        text: text,
      };
      state.push(newTodo);
    },
  },
});

export const { addTodo } = todoSlice.actions;

export default todoSlice.reducer;
