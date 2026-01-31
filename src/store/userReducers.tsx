// src/features/counter/counterSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { current } from "@reduxjs/toolkit";
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    items: [] as any,
    loading: false,
    error: null as string | null,
  },
  reducers: {
        addUsersToStore: (state, action) =>{
            state.items = action.payload;
        },
        updateUsersStore: (state, action: PayloadAction<{email:string, isActive:boolean}>) => {
            console.log(action.payload);
            console.log(current(state.items));
            const user = state.items.find((x:any)=>x.email==action.payload.email);
            if(user)
              user.isActive = action.payload.isActive;
            console.log(current(state.items));
        }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAvatar.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.items = action.payload;
      })
      .addCase(fetchUserAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error';
      });
  },
});
export const fetchUserAvatar = createAsyncThunk<string, void>(
    'user/fetchUserAvatar',
    async () => {
        let url = process.env.REACT_APP_API_URL+'api/Authenticate';
  let res = await fetch(url, {
        method:'GET',
        headers: {
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    });
    if(!res.ok)
        return "";
    let data = await res.json();
    return data;
}
);
//export const { getState } = projectSlice.actions;
export default userSlice.reducer;