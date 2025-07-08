import React from 'react'
import { useForm } from 'react-hook-form'
import useAuth from '../../../hook/useAuth'
import { NavLink } from 'react-router'
import SocalLogin from '../socalLogin/SocalLogin'
const Register = () => {
const {register,handleSubmit,formState:{errors}} = useForm()
const { createUser} = useAuth()
const onSubmit=data=>{
    console.log(data.email);
    console.log(data.password);
createUser(data.email,data.password)
.then((result)=>console.log(result.user))
.catch((err)=>console.log(err))    
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