import "./NavBar.css";
import { Link } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function NavBar() {
  return (
    <>
      <div className="nav">
        <ul>
          <a href="/" className="logo">
            <img src="./sssam_split_no_bg.png" alt="bear logo" />
          </a>
            {/* <h1 className="logo">Logo</h1> */}
          <div className="non-logo">
            <li>
            <Link to="/about">
              <InfoOutlinedIcon />
            </Link>
            </li>
            {/* <li>
              <Link to="/howto"> Howto?</Link>
            </li> */}
          </div>
        </ul>
      </div>
    </>
  );
}

export default NavBar;
