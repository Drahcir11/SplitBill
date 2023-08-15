import { Link } from 'react-router-dom';
import './NextButton.css';

const NextButton = ({ buttonName, to, clickEvent, type}) => {
  return(
    <div className="next-button">
      <Link to={to}>
        <button type={type} onClick={clickEvent}>{buttonName}</button>
      </Link>
    </div>
  );
}

export default NextButton;