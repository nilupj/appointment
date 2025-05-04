import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set the document title for the application
document.title = "MediConnect - Healthcare at Your Fingertips";

createRoot(document.getElementById("root")!).render(<App />);
