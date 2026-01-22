import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Router from "./routes/Router";
import { restoreCSRF } from "./store/csrf";
import { restoreUser } from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // ✅ if restoreCSRF is a normal function (not a thunk), call it directly
        await restoreCSRF();

        // ✅ restore the session (this may 401 if no cookie, that's fine)
        await dispatch(restoreUser());
      } catch (e) {
        console.error("App init failed:", e);
      } finally {
        // ✅ ALWAYS render the app
        setIsLoaded(true);
      }
    })();
  }, [dispatch]);

  if (!isLoaded) return null; // or return a loading div/spinner

  return <Router />;
}

export default App;

