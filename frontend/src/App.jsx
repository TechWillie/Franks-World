import { useEffect } from "react";
import Router from "./routes/Router";
import { restoreCSRF } from './store/csrf';

function App() {
  useEffect(() => {
    restoreCSRF();
  }, []); 

  return <Router />;
}

export default App;
