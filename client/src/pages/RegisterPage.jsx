
import "../styles/Register.scss";
import { useEffect, useState } from "react";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null
  })
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const {name, value, files} = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [name]: name === "profileImage"? files[0] : value
    })
  }

  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const register_form = new FormData()
      for (let key in formData){
        register_form.append(key, formData[key])
      }
      const response = await  fetch(`${API_URL}/auth/register`, {
        method: "POST",
        body: register_form
      })
      if(response.ok){
        navigate("/login")
      }

    } catch (err) {
      console.log(`Registration failed`, err.message)
    }
  }

  useEffect(()=>{
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "")
  })
  
  return (
    <div className="register">
        <div className="register_content">
          <form action="" className="register_content_form" onSubmit={handleSubmit}>
            <input type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
            <input type="text" placeholder="Last Name" name="lastName" value={formData.lastName}onChange={handleChange}  required />
            <input type="email" placeholder="Email" name="email" value={formData.email}onChange={handleChange} required />
            <input type="password" placeholder="Password" name="password" value={formData.password}onChange={handleChange} required />
            <input type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            {
              !passwordMatch && (
                <p style={{color: "red"}}>Password does not match</p>
              )
            }
            
            <input type="file" name="profileImage" id="image" accept="image/*"onChange={handleChange} required style={{display: "none"}}/>
            <label htmlFor="image">
              <img src="https://res.cloudinary.com/doqjl4k7t/image/upload/v1714806427/coastalhaven/addImage.png" alt="add profile image" />
              <p>Upload your profile image</p>
            </label>

            {
              formData.profileImage && (
                <img src={URL.createObjectURL(formData.profileImage)} alt="Profile photo" style={{maxWidth:"50px"}} />
              )
            }
            <button type="submit" disabled={!passwordMatch}>Register</button>
          </form>
          <a href="/login">Already have an account? Login here</a>
        </div>
    </div>
  )
}

export default RegisterPage
