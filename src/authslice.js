import {createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import axiosclient from "../src/utils/axiosclient";

export const registeruser = createAsyncThunk(
    'auth/register',
    async(userdata , {rejectWithValue}) =>{
        try{
            const response = await axiosclient.post("/user/register" , userdata);
            return response.data.user;
        }
        catch(err){
          return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const loginuser = createAsyncThunk(
    'auth/login',
    async (credentials , {rejectWithValue}) =>{
        try{
            const response = await axiosclient.post("/user/login" , credentials);
            return response.data.user;
        }
        catch(err){
          return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const checkauth = createAsyncThunk(
    'auth/check',
    async (_, {rejectWithValue}) =>{
        try{
            const response = await axiosclient.get("/user/check");
            return response.data.user;
        }
        catch(err){
          return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const logoutuser = createAsyncThunk(
    "auth/logout",
    async (_, {rejectWithValue}) =>{
    try{
        await axiosclient.post("/user/logout");
        return null;
    }
    catch(err){
      return rejectWithValue(err.response?.data || err.message);
    }}
)

const authslice = createSlice({
    name : "auth",
    initialState : {
        isauth : false,
        user : null,
        loading : true,
        error : null
    },
    reducers : {},
    extraReducers : (builder) =>{
        builder
        //registeruser case
        .addCase(registeruser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(registeruser.fulfilled, (state, action) => {
            state.loading = false;
            state.isauth = !!action.payload;
            state.user = action.payload;
          })
          .addCase(registeruser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Something went wrong';
            state.isauth = false;
            state.user = null;
          })

          // Login User Cases
      .addCase(loginuser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginuser.fulfilled, (state, action) => {
        state.loading = false;
        state.isauth = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isauth = false;
        state.user = null;
      })
  
      // Check Auth Cases
      .addCase(checkauth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkauth.fulfilled, (state, action) => {
        state.loading = false;
        state.isauth = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkauth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isauth = false;
        state.user = null;
      })
  
      // Logout User Cases
      .addCase(logoutuser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutuser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isauth = false;
        state.error = null;
      })
      .addCase(logoutuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isauth = false;
        state.user = null;
      });
    }
})

export default authslice.reducer;