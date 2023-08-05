import './AddButton.css';

const AddButton = ({ buttonName, type }) => {
  return(
    <div className="add-button">
        <button type={type}>{buttonName}</button>
    </div>
  );
}

export default AddButton;