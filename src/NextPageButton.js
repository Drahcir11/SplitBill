import { Link } from 'react-router-dom';
import './index.css';

const NextButton = ({ buttonName, to }) => {
  return(
    <div className="next-button">
      <Link to={to}>
        <button>{buttonName}</button>
      </Link>
    </div>
  );
}

export default NextButton;