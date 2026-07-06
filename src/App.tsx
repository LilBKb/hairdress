import { useEffect } from "react";
import BranchesPage from "./pages/Main/BranchesPage";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchCurrentUser, logout } from "./store/slices/userSlice";

function App() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    const handler = () => dispatch(logout());
    window.addEventListener("auth:session-expired", handler);
    return () => window.removeEventListener("auth:session-expired", handler);
  }, [dispatch]);

  return <BranchesPage />;
}

export default App;
