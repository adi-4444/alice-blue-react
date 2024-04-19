import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "../../../common/utils/AxiosInstance";




export const getFunds = createAsyncThunk(
   'getFunds',
   async ({ id, sessionId }, { rejectWithValue }) => {
      const URL = `/limits/getRmsLimits`
      try {
         const res = await AxiosInstance.get(URL, {}, {
            headers: { 'Authorization': `Bearer ${id} ${sessionId}`, 'Content-Type': 'application/json' }
         })
         console.log("getFunds", res);
         return { response: JSON.parse(JSON.stringify(res)) }
      } catch (error) {
         console.log("getFunds", error);
         return JSON.parse(JSON.stringify(rejectWithValue(error)))
      }
   }
)