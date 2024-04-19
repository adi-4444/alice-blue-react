import { createSlice } from "@reduxjs/toolkit";
import { createWsSession, getEncKey, getSessionId, validateSessionId } from "./authActions";

const initialState = {
   loading: false,
   info: {},
   userId: null,
   success: null,
   error: null,
   emsg: null,
   wsSessionId: null,
   susertoken: null,
   wsSessionAt: null,
   sessionId: null,
}

const authSlice = createSlice({
   name: 'authSlice',
   initialState,
   reducers: {
      setUserAuthData: (state, { payload }) => {
         for (const key in payload) {
            state.sessionId = payload[key].sessionId
            state.userId = { userId: payload[key].userId }
            state.lastConnectedAt = payload[key].lastConnectedAt
            state.wsSessionId = payload[key].wsSessionId
            state.susertoken = payload[key].susertoken
         }
      },
      clearUserAuthData: () => initialState
   },
   extraReducers: (builder) => {
      // get EncKey
      builder.addCase(getEncKey.pending, (state) => {
         state.loading = true;
      })
      builder.addCase(getEncKey.fulfilled, (state, { payload }) => {
         state.loading = false;
         if (payload?.response?.data?.login) {
            state.success = true
         } else {
            state.error = true
         }
         state.info = payload?.response?.data
         state.userId = payload?.data
         console.log(payload);
      })
      builder.addCase(getEncKey.rejected, (state, { payload }) => {
         state.loading = false;
         state.info = state.payload
         console.log(payload);
      })

      // get user Session Id
      builder.addCase(getSessionId.pending, (state) => {
         state.loading = true;
      })
      builder.addCase(getSessionId.fulfilled, (state, { payload }) => {
         state.loading = false;
         if (payload?.response?.data?.sessionID) {
            state.sessionId = payload?.response?.data?.sessionID
         } else if (payload?.response?.data?.emsg) {
            state.error = true
            state.emsg = payload?.response?.data?.emsg
         }
         console.log(payload);
      })
      builder.addCase(getSessionId.rejected, (state, { payload }) => {
         state.loading = false;
         state.info = state.payload
         console.log(payload);
      })

      // Validate Session Id
      builder.addCase(validateSessionId.pending, (state) => {
         state.loading = true;
      })
      builder.addCase(validateSessionId.fulfilled, (state, { payload }) => {
         state.loading = false;
         // if (payload?.response?.data?.sessionID) {
         //    state.sessionId = payload?.response?.data?.sessionID
         // } else if (payload?.response?.data?.emsg) {
         //    state.error = true
         //    state.emsg = payload?.response?.data?.emsg
         // }
      })
      builder.addCase(validateSessionId.rejected, (state, { payload }) => {
         state.loading = false;
         // state.info = state.payload
      })

      // Create WebSocket Session 
      builder.addCase(createWsSession.pending, (state) => {
         state.loading = true;
      })
      builder.addCase(createWsSession.fulfilled, (state, { payload }) => {
         state.loading = false;
         // if (payload?.response?.data?.sessionID) {
         //    state.sessionId = payload?.response?.data?.sessionID
         // } else if (payload?.response?.data?.emsg) {
         //    state.error = true
         //    state.emsg = payload?.response?.data?.emsg
         // }
         state.wsSessionId = payload?.response?.data?.result?.wsSess
      })
      builder.addCase(createWsSession.rejected, (state, { payload }) => {
         state.loading = false;
         // state.info = state.payload
         console.log(payload);
      })

   }
})

export const { setUserAuthData } = authSlice.actions

export default authSlice.reducer
