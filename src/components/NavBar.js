import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
// styles
import './NavBar.css';

// components
import Searchbar from "./Searchbar";


const NavBar = () => {
  const { color } = useTheme();
  return(
    <div className="navbar" style={{ background: color }}>
      <nav>
        <Link to="/" className="brand">
          <h1>Cooking Nusantara</h1>
        </Link>
        <Searchbar />
        <Link to="create?action=create">
          Create Recipe
        </Link>
      </nav>
    </div>
  )
};

export default NavBar;