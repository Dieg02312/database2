const {request, response} = require('express');
const usermodels = require('../models/user');
const pool=require('../db');


const listUsers = async (req = request, res = response) => {
    let conn; 

    try{
        conn = await pool.getConnection();

    const users = await conn.query (usermodels.getAll, (err)=>{
        if(err){
            throw err
        }
    });

    res.json(users);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
    
}

const listUsersByID = async (req = request, res = response) => {
    

    if (isNaN(id)) {
        res.status(400).json({msg: 'Invalid ID'});
        return;
    }

    let conn; 
    try{
        conn = await pool.getConnection();

    const [user] = await conn.query (usermodels.getByID, [id], (err)=>{
        if(err){
            throw err
        }
    });

    if (!user) {
        res.status(404).json({msg: 'User not foud'});
        return;
    }
    
    
    res.json(user);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}





const addUser =async(req = request, res= response)=>{
    let conn;
    const {
        username,
        email,
        password,
        name,
        lastname,
        phone_number ='',
        role_id,
        is_active =1,
    } = req.body;
    if (!username|| !email|| !password|| !name|| !lastname|| !role_id){
res.status(400).json({msg:'Missing informarion'});
return;
        }
        const user= [username, email, password, name, lastname, phone_number, role_id, is_active ]


    
    try {

        conn = await pool.getConnection();
        
        const [usernameUser] = await conn.query(
            usermodels.getByUsername,
            [username],
            (err) => {if (err) throw err;}
        );
        if (usernameUser){
            res.status(409).json({msg:`User with username ${username} already exists`});
            return;
        }

        const [emailUser] = await conn.query(
            usermodels.getByEmail,
            [email],
            (err) => {if (err) throw err;}
        );
        if (emailUser){
            res.status(409).json({msg:`User with email ${email} already exists`});
            return;
        }

        
        const userAdded = await conn.query(usermodels.addRow,[...user],(err)=>{

        })
        
        if (userAdded.affecteRows === 0) throw new Error ({msg:'Failed to add user'});
        res.json({msg:'User add succesfully'});
    }catch(error){
console.log(error);
res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}


//Update del profe Julio 

const updateUser=async(req, res)=>{
  const {
      username,
      email,
      password,
      name,
      lastname,
      phone_number ,
      role_id,
      is_active ,
  } = req.body;

const {id} = req.params;
let newUserData=[
  username,
  email,
  password,
  name,
  lastname,
  phone_number ,
  role_id,
  is_active   
];
let conn;
try{
  conn = await pool.getConnection();
const [userExists]=await conn.query(
  usermodels.getByID,
  [id],
  (err) => {if (err) throw err;}
);
if (!userExists || userExists.id_active === 0){
  res.status(404).json({msg:'User not found'});
  return;
}

const [usernameUser] = await conn.query(
  usermodels.getByUsername,
  [username],
  (err) => {if (err) throw err;}
);
if (usernameUser){
  res.status(409).json({msg:`User with username ${username} already exists`});
  return;
}

const [emailUser] = await conn.query(
  usermodels.getByEmail,
  [email],
  (err) => {if (err) throw err;}
);
if (emailUser){
  res.status(409).json({msg:`User with email ${email} already exists`});
  return;
}

const oldUserData = [
  userExists.username,
  userExists.email,
  userExists.password,
  userExists.name,
  userExists.lastname,
  userExists.phone_number ,
  userExists.role_id,
  userExists.is_active  
];

newUserData.forEach((userData, index)=> {
  if (!userData){
      newUserData[index] = oldUserData[index];
  }
})

const userUpdate = await conn.query(
  usermodels.updateUser,
  [...newUserData, id],
  (err) => {if (err) throw err;}
);
if(userUpdate.affecteRows === 0){
  throw new Error ('User not updated');
}
res.json({msg:'User updated successfully'})
}catch (error){
      console.log(error);
      res.status(500).json(error);
  } finally{
      if (conn) conn.end();
  }
}


const deleteUser = async (req, res)=>{
    let conn;

    try{
        conn = await pool.getConnection();
        const {id} =req.params;
        const [userExists] =await conn.query(
            usermodels.getByID,
            [id],
            (err) => {if (err) throw err;}
        );
        if(!userExists || userExists.is_active === 0){
            res.status(404).json({msg:'User not Found'});
            return;
        }

        const userDelete = await conn.query(
            usermodels.deleteRow,
            [id],
            (err) => {if(err)throw err;}
        );
        if (userDelete.affecteRows===0){
            throw new Error({msg:'failed to delete user'})
        };
        res.json({msg:'user deleted succesfully'});
    }catch(error){
        console.log(error);
        res.status(500).json(error);

    }finally{
       if(conn) conn.end(); 
    }
}

const sigIn = async (req = request, res = response)=>{
  let conn;
  const {username, password}=req.body;
res.status(400).json({msg:'Username and password are required'})
  return

  try{
    conn = await pool.getConnection();

    const [user] = await conn.query(
      userModel.getByUsername,
      [username],
      (err)=> { if (err) throw err;}
    )
    if (!user || user.is_active === 0){
      res.status(404).json({msg: 'Wrong username or password'});
      return;
    }
    const passwordOk = bcrypt.compare(password, user.password);
    if (!passwordOk){
      res.status(404).json({msg: 'wrong username or password'});
      return;
    }

  } catch (error){
    console.log(error);
    res.status(500).json(error);
  }finally{
    if(conn)conn.end();
  }
}

module.exports={listUsers, listUsersByID, addUser, updateUser, deleteUser};