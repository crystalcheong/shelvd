import { AppThemeMode } from '@/data/static/app'
import { StoreSlicePrefix } from '@/data/static/store'
import { env } from '@/env'
import { createAsyncSlice } from '@/utils/store'
import { PayloadAction } from '@reduxjs/toolkit'
import { z } from 'zod'

const AppState = z.object({
  navDrawerVisibility: z.boolean().default(false),
  searchCommandVisibility: z.boolean().default(false),
  serverMaintainanceVisibility: z.boolean().default(env.VITE_SERVER_FLAG),
  themeMode: AppThemeMode,
})
type AppState = z.infer<typeof AppState>

const DefaultAppState: AppState = {
  navDrawerVisibility: false,
  searchCommandVisibility: false,
  serverMaintainanceVisibility: true,
  themeMode: AppThemeMode.enum.dark,
}

export const AppSlice = createAsyncSlice({
  name: `${StoreSlicePrefix}app`,
  initialState: DefaultAppState,
  reducers: (create) => ({
    setSearchCommandVisibility: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.searchCommandVisibility = action.payload
      },
    ),
    setNavDrawerVisibility: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.navDrawerVisibility = action.payload
      },
    ),
    setServerMaintainanceVisibility: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.serverMaintainanceVisibility = action.payload
      },
    ),
    setThemeMode: create.reducer(
      (state, action: PayloadAction<AppThemeMode>) => {
        state.themeMode = action.payload
      },
    ),
  }),
  selectors: {
    state: (state) => state,

    searchCommandVisibility: (state) => state.searchCommandVisibility,
    navDrawerVisibility: (state) => state.navDrawerVisibility,
    themeMode: (state) => state.themeMode,
  },
})

export const AppActions = AppSlice.actions
export const AppSelectors = AppSlice.selectors
