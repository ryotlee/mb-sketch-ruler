import React from "react";
import "./App.css";
import Editor, { EditorProps } from "./components/Editor";

function App() {
  const editorConfig: EditorProps = {
    scale: 1,
    lang: "zh-CN",
    pageW: 1366, // 显示标尺
    pageH: 768,
    showReferLine: true, // 显示参考线
  };

  return (
    <div className="App">
      <Editor {...editorConfig}></Editor>
    </div>
  );
}

export default App;
