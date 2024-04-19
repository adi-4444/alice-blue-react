
export const saveUserToLocal = (inputData) => {
   // convert the stringified data to object
   const userData = JSON.parse(localStorage.getItem("userData")) || {};
   // if the userId already exists, update the data
   if (userData[inputData.userId]) {
      userData[inputData.userId] = { ...userData[userId], ...inputData };
   } else {
      // if the userId does not exist, create a new entry
      userData[inputData.userId] = inputData;
   }
   // save the data to localStorage by changing it back to string , play to false and return the data
   userData[inputData.userId].play = false;
   localStorage.setItem("userData", JSON.stringify(userData));
   return userData;
}

export const DeleteUserToLocal = (data) => {
   localStorage.setItem("userData", JSON.stringify(data));
};

export const setUserSession = (id, session) => {
   const localData = JSON.parse(localStorage.getItem("userData"));
   localData[id].lastConnectedAt = new Date().toISOString();
   localData[id].play = false;
   localData[id].wsSessionId = "";
   localData[id].wsSessionAt = ""
   localData[id].sessionId = session;
   localStorage.setItem("userData", JSON.stringify(localData));
   const data = {};
   data[id] = {
      userId: id,
      lastConnectedAt: new Date().toISOString(),
      wsSessionId: "",
      wsSessionAt: "",
      susertoken: "",
      sessionId: session
   };
   localStorage.setItem("retainLastSession", JSON.stringify(data));
   return { localData, data };
}

export const addWsToLastSession = (id, wsSessionId, susertoken) => {
   const lastSession = JSON.parse(localStorage.getItem("retainLastSession"));
   lastSession[id].wsSessionId = wsSessionId;
   lastSession[id].susertoken = susertoken
   lastSession[id].wsSessionAt = new Date().toISOString()
   localStorage.setItem("retainLastSession", JSON.stringify(lastSession));
}

export const resetAllSessions = (id) => {
   const localData = JSON.parse(localStorage.getItem("userData"));
   localData[id].sessionId = "";
   localData[id].susertoken = ""
   localData[id].wsSessionId = "";
   localData[id].play = false;
   localStorage.setItem("userData", JSON.stringify(localData));

   const lastSession = JSON.parse(localStorage.getItem("retainLastSession"));
   lastSession[id].sessionId = "";
   lastSession[id].wsSessionId = "";
   lastSession[id].susertoken = "";
   localStorage.setItem("retainLastSession", JSON.stringify(lastSession));
   return { localData, lastSession };
}