import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1> Best place to find roommates and sublet!</h1>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link className="home-btn" to={{ pathname: "/", search: "?mine=0" }}>
            All houses
          </Link>
          <Link className="home-btn" to={{ pathname: "/", search: "?mine=1" }}>
            My houses
          </Link>

          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span>{user.email}</span>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}

          {!user && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
