// import { io } from "socket.io-client";

// const URL = "http://localhost:5000";

// export const socket = io(URL, {
//   autoConnect: false, // jab login ho tab connect
// });


import { io } from "socket.io-client";

const URL = "http://localhost:5000";

export const socket = io(URL, {
  autoConnect: false, // ✅ Manual connect after login
  transports: ["websocket", "polling"], // ✅ Better compatibility
});
