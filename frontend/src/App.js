import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ExamplePage from "./Pages/ExamplePage";

function App() {
  return (
    <div>
      <Router>
        <div className="container">
          <Routes>
            <Route exact path="/" element={<ExamplePage />} />
          </Routes>
          <ToastContainer/>
        </div>
      </Router>
    </div>
  );
}
export default App; 