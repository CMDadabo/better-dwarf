import { ipcRenderer } from "electron";

export default async function readDwarves() {
  const raw_dwarves = await ipcRenderer.invoke("read-dwarves");

  try {
    return JSON.parse(raw_dwarves[1]).data;
  } catch (err) {
    console.error(err);
    return [];
  }
}
