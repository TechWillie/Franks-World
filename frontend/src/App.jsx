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
      // ✅ must dispatch if restoreCSRF is a thunk
      await dispatch(restoreCSRF());

      // ✅ restores session user into redux if cookie exists
      await dispatch(restoreUser());

      // ✅ now allow UI to render
      setIsLoaded(true);
    })();
  }, [dispatch]);

  // ✅ prevents "sessionUser null" flash + wrong UI render
  if (!isLoaded) return null;

  return <Router />;
}

export default App;

