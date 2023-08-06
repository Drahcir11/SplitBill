import './EditButton.css';

const EditButton = ({ buttonName, type }) => {
  return(
    <div className="edit-button">
        <button type={type}>{buttonName}</button>
    </div>
  );
}

export default EditButton;