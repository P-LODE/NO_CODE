type GeneralEvent = "canvasScroll" | "undo" | "redo" | "load" | "update";

type EdtiorBuiltInEvents = any;

type EditorEvents = GeneralEvent | EdtiorBuiltInEvents;

export default EditorEvents;
