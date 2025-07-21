import "../styles.css"
import {useNavigate} from "react-router";
export function AddApplicationSection(){
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/create");
    };
    return( <div className="add-applications-section">
        <button className="button" onClick={handleClick}>+ Add Application</button>
    </div>)
}