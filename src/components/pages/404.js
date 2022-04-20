import {Link} from "react-router-dom";
import Error from "../error/Error";

const Pages404 = () => {
    return (
        <div>
            <Error/>
            <p style={{'fontSize': '30px', 'fontWeight': 'bold', 'textAlign': 'center', 'color': 'red'}}>Doesn't exist this page</p>
            <Link to="/" style={{'fontSize': '20px', 'fontWeight': 'bold', 'display': 'block',
                      'margin': '20px auto 0', 'color': 'blue', 'textAlign': 'center'}}>Go back to main page</Link>
        </div>
    )
}

export default Pages404;