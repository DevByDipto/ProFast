import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import useAuth from '../../../hooks/useAuth'
import { NavLink } from 'react-router'
import SocalLogin from '../socalLogin/SocalLogin'
import axios from 'axios'
import useAxios from '../../../hooks/useAxios'
const Register = () => {
const {register,handleSubmit,formState:{errors}} = useForm()
const { createUser,updateUserProfile} = useAuth()
const axiosInstance = useAxios()
const [profilePic,setProfilePic] = useState()


const onSubmit=data=>{  
createUser(data.email,data.password)
.then(async(result)=>{
  console.log('from create user',result.user)
// update user in database
const userInfo={
  email: data.email,
  role:'user' ,// default role
  created_at: new Date().toISOString(),
  last_log_in: new Date().toISOString()
}

const userRes = await axiosInstance.post("/user",userInfo)
console.log("userinfo",userRes.data);


  // update user is firebase
updateUserProfile(data.name,profilePic)
.then(()=>console.log('successfull'))
.catch(err=>console.log(err))
})
.catch((err)=>console.log(err.message))    
}

const handleFileImageSubmite =async(e)=>{
  const image = e.target.files[0]
  const formData = new FormData()
  formData.append('image', image)
  console.log(formData);

  const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`

  const res = await axios.post(imageUploadUrl, formData)
  setProfilePic(res.data.data.url);
  
}

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
              <h1 className="text-5xl font-bold">Create an account</h1>
       <form onSubmit={handleSubmit(onSubmit)}>
         <fieldset className="fieldset">
            {/* email */}
          <label className="label">Email</label>
          <input type="email" {...register("email",{required:true})} className="input" placeholder="Email" />
          {errors.email?.type === 'required' && <p className='text-red-500'>email must required</p>}

            {/* name */}
          <label className="Name">Name</label>
          <input type="name" {...register("name",{required:true})} className="input" placeholder="name" />
          {errors.email?.type === 'required' && <p className='text-red-500'>name must required</p>}

{/* image file */}
          <label className="file">File</label>
<input onChange={handleFileImageSubmite} type="file" name='file' className="file-input file-input-primary" />

          {/* password */}
          <label className="label">Password</label>
          <input type="password" {...register('password',{required: true,minLength:6})} className="input" placeholder="Password" />
          {
            errors.password?.type === 'required' && <p className='text-red-500'>password must required</p>
          }
          {
            errors.password?.type === 'minLength' && <p className='text-red-500'> 6 desiget must required</p>
          }

          <div><a className="link link-hover">Forgot password?</a> 
          </div>
          <button className="btn btn-primary text-black mt-4">Register</button>
          <SocalLogin></SocalLogin>
          <p><small>have a account.<NavLink to='/login' className='btn-link text-primary'>Login</NavLink></small></p>
        </fieldset>
       </form>
      </div>
    </div>
  
  )
}

export default Register