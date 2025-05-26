import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Router from "./routes/Router";
import { restoreCSRF } from './store/csrf';
import { restoreUser } from "./store/session";

function App() {
  const dispatch = useDispatch();
useEffect(() => {
    const init = async () => {
      await restoreCSRF();              // Get CSRF token and set cookie
      await dispatch(restoreUser());    // Restore session if valid JWT cookie exists
    };

    init();
  }, [dispatch]);

  return <Router />;

}
export default App;
