import { Link } from "react-router-dom";

// styles
import './NavBar.css';

// components
import Searchbar from "./Searchbar";

const NavBar = () => {
  return(
    <div className="navbar">
      <nav>
        <Link to="/" className="brand">
          <h1>Cooking Nusantara</h1>
        </Link>
        <Searchbar />
        <Link to="create">
          Create Recipe
        </Link>
      </nav>
    </div>
  )
};

export default NavBar;