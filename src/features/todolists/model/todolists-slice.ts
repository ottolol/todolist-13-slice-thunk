import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"
import { todolistsApi } from "../api/todolistsApi"
import { RootState } from "@/app/store"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    // deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
    //   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
    //   if (index !== -1) {
    //     state.splice(index, 1)
    //   }
    // }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    // createTodolistAC: create.preparedReducer(
    //   (title: string) => ({ payload: { title, id: nanoid() } }),
    //   (state, action) => {
    //     state.push({ ...action.payload, filter: "all", addedDate: "", order: 0 })
    //   },
    // ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
        return action.payload.todolists.map((tl) => {
          return { ...tl, filter: "all", entityStatus: "idle" }
        })
      })
      .addCase(fetchTodolistsTC.rejected, (state, action) => {
        // обработка ошибки при запросе за тудулистами
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.push({ ...action.payload, filter: "all", addedDate: "", order: 0 })
      })
      .addCase(createTodolistTC.rejected, (state, action) => {
        // Обработка ошибок, если необходимо
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
      .addCase(deleteTodolistTC.rejected, (state, action) => {
        // Обработка ошибок, если необходимо
      })
  },
})

export const { deleteTodolistAC, changeTodolistFilterAC, createTodolistAC } = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer

// создаём санку
export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolistsTC`, async (_, thunkAPI) => {
  try {
    // в санке можно делать побочные эффекты (запросы на сервер)
    const res = await todolistsApi.getTodolists()
    // и диспатчить экшены (action) или другие санки (thunk)
    return { todolists: res.data }
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (payload: { id: string; title: string }, thunkAPI) => {
    try {
      await todolistsApi.changeTodolistTitle(payload)
      return payload
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const createTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/createTodolistTC`,
  async (payload: { title: string }, thunkAPI) => {
    try {
      await todolistsApi.createTodolist(payload.title)
      return payload // Возвращаем данные тудулиста
    } catch (error) {
      return thunkAPI.rejectWithValue(error) // Обработка ошибок
    }
  },
)

export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolistTC`,
  async (payload: { id: string }, thunkAPI) => {
    try {
      await todolistsApi.deleteTodolist(payload.id)
      return payload
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

// Добавляем селекторы
export const selectTodolists = (state: RootState): DomainTodolist[] => state.todolists
