import sha256 from "crypto-js/sha256";

export function timeAgo(lastConnectedAt) {
   const currentDate = new Date();
   const connectedDate = new Date(lastConnectedAt);
   const timeDifference = currentDate - connectedDate;

   const seconds = Math.floor(timeDifference / 1000);
   const minutes = Math.floor(seconds / 60);
   const hours = Math.floor(minutes / 60);
   const days = Math.floor(hours / 24);

   if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
   } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
   } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
   } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
   }
}

export function getTimeDifferenceInHours(lastConnectedAt) {
   const lastConnectedTime = new Date(lastConnectedAt);
   const currentTime = new Date();
   const timeDifference = currentTime - lastConnectedTime;
   const hoursDifference = timeDifference / (60 * 60 * 1000);
   return hoursDifference;
}

export const encryptSHA256 = (id, api, enc) => {
   const hashed = sha256(id + api + enc);
   return hashed.toString();
};

export const openConsoleHandler = () => {
   window.open(
      "./console",
      "Easy Click Console",
      "height=780,width=1280,menubar=no,location=no,toolbar=no,resizable=yes,scrollbars=yes"
   );
};


export const doubleHashWsSessionId = (sessionId) => {
   const hash1Str = sha256(sessionId).toString();
   const hash2Str = sha256(hash1Str).toString();
   console.log("suser", hash2Str);
   return hash2Str;
}