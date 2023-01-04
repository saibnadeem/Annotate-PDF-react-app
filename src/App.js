import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DocumentList from "./Components/DocumentList";
import DocumentPage from "./Components/DocumentPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<DocumentList />} />
        <Route path="/document/:id" element={<DocumentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
