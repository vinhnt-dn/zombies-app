import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type ZombieState = {
  zombies: Zombie[]
}

export type Zombie = {
  id: number
  name: string
}

/**
 * Store constructor
 */

const NAME = 'zombie'
const initialState: ZombieState = {
  zombies: [],
}

/**
 * Actions
 */

export const generateZombie = createAsyncThunk<
  ZombieState,
  { newZombie: Zombie },
  { state: any }
>(`${NAME}/generateZombie`, async ({ newZombie }, { getState }) => {
  const {
    zombie: { zombies },
  } = getState()
  console.log('Actions generate zombie: ', newZombie)
  return { zombies: [...zombies, newZombie] }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder.addCase(
      generateZombie.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
