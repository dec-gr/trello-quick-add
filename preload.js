const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  closeWindow: () => ipcRenderer.send('close-window'), // Expose closeWindow function
  getEnv: (LIST_ID) => process.env[LIST_ID],
  getEnv: (API_KEY) => process.env[API_KEY],
  getEnv: (TOKEN) => process.env[TOKEN],

  on: (channel, callback) => {
    const validChannels = ['focus-input'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  removeListener: (channel, callback) => {
    const validChannels = ['focus-input'];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, callback);
    }
  },
});
