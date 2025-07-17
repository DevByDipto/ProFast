import React from 'react'

const Profile = () => {

const handleSubmit =(e)=>{
e.preventDefault()

console.log(e.target.avatar.files[0]);
console.log(e.target.username.value);

}

  return (
    <div>
        <form id="f" onSubmit={handleSubmit}>
  <input type="text" name="username" className='border m-5'/>
  <input type="file" name="avatar" className='border m-5'/>
  <button type='submite' defaultValue='submit' className='btn'>submit</button>
</form>
    </div>
  )
}

export default Profile