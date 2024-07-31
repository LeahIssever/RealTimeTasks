import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {

    const navigate = useNavigate();
    const [emailExists, setEmailExists] = useState(false);
    const [signUpData, setSignUpData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const onTextChange = e => {
        const copy = { ...signUpData };
        copy[e.target.name] = e.target.value;
        setSignUpData(copy);
    }

    const onFormSubmit = async (e) => {
        e.preventDefault();
        const { data } = await axios.get('/api/account/emailexists', signUpData.email);
        setEmailExists(data.exists);
        if (emailExists) {
            return;
        }
        await axios.post('/api/account/signup', signUpData);
        navigate('/login');
    }
    
    return (
        <div className="row" style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
            <div className="col-md-6 offset-md-3 bg-light p-4 rounded shadow">
                <h3>Sign up for a new account</h3>
                {emailExists && <span className='text-danger'>There's already an account associated with this email. Try a different email</span>}
                <form onSubmit={onFormSubmit}>
                    <input onChange={onTextChange} value={signUpData.firstName} type="text" name="firstName" placeholder="First Name" className="form-control" />
                    <br />
                    <input onChange={onTextChange} value={signUpData.lastName} type="text" name="lastName" placeholder="Last Name" className="form-control" />
                    <br />
                    <input onChange={onTextChange} value={signUpData.email} type="text" name="email" placeholder="Email" className="form-control" />
                    <br />
                    <input onChange={onTextChange} value={signUpData.password} type="password" name="password" placeholder="Password" className="form-control" />
                    <br />
                    <button className="btn btn-primary">Signup</button>
                </form>
            </div>
        </div>
    );
}
export default Signup;