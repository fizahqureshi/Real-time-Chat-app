// export const playNotification = () => {
//   const audio = new Audio("/notification.mp3");
//   audio.play().catch(() => {});
// };


const audio = new Audio("/notification.mp3");

export const playNotification = () => {
  audio.currentTime = 0;
  audio.play().catch(() => {});
};
