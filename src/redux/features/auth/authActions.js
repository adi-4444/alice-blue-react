import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "../../../common/utils/AxiosInstance";


export const getEncKey = createAsyncThunk(
   'getEncKey',
   async (data, { rejectWithValue }) => {
      const URL = `/customer/getAPIEncpkey`
      try {
         const res = await AxiosInstance.post(URL, data)
         console.log("getEncKey", res);
         return { data, response: JSON.parse(JSON.stringify(res)) }
      } catch (error) {
         console.log("getEncKey", error);
         return JSON.parse(JSON.stringify(rejectWithValue(error)))
      }
   }
)

export const getSessionId = createAsyncThunk(
   'getSessionId',
   async (data, { rejectWithValue }) => {
      const URL = `/customer/getUserSID`
      try {
         const res = await AxiosInstance.post(URL, data)
         console.log("getSessionId", res);
         return { response: JSON.parse(JSON.stringify(res)) }
      } catch (error) {
         console.log("getSessionId", error);
         return JSON.parse(JSON.stringify(rejectWithValue(error)))
      }
   }
)

export const validateSessionId = createAsyncThunk(
   'validateSessionId',
   async ({ id, sessionId }, { rejectWithValue }) => {
      const URL = `/ws/invalidateSocketSess`
      try {
         const res = await AxiosInstance.post(URL, {}, {
            headers: { 'Authorization': `Bearer ${id} ${sessionId}` }
         })
         console.log("validateSessionId", res);
         return { response: JSON.parse(JSON.stringify(res)) }
      } catch (error) {
         console.log("validateSessionId", error);
         return JSON.parse(JSON.stringify(rejectWithValue(error)))
      }
   }
)

export const createWsSession = createAsyncThunk(
   'createWsSession',
   async ({ id, sessionId }, { rejectWithValue }) => {
      const URL = `/ws/createWsSession`
      try {
         const res = await AxiosInstance.post(URL, { "loginType": "API" }, {
            headers: { 'Authorization': `Bearer ${id} ${sessionId}` }
         })
         console.log("createWsSession", res);
         return { response: JSON.parse(JSON.stringify(res)) }
      } catch (error) {
         console.log("createWsSession", error);
         return JSON.parse(JSON.stringify(rejectWithValue(error)))
      }
   }
)


