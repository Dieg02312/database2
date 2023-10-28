const usermodels = {
    getAll: `
    SELECT 
    * 
    FROM 
    user`,
    getByID: `
    SELECT
    *
    FROM
    user
    WHERE
    id= ?
    `,
    addRow:`
    INSERT INTO
    user(
        username,
        email,
        password,
        name,
        lastname,
        phone_number,
        role_id,
        is_active
    )
    VALUES (
        ?,?,?,?,?,?,?,?
    )`,
    getByUsername:`
    SELECT 
    id 
    FROM 
    user 
    WHERE username =?
    `,

getByEmail:`
    SELECT 
    id 
    FROM 
    user 
    WHERE 
    email =?
    `,

    updateUser:`
    UPDATE
    user
    SET
        username = ?,
        email = ?,
        password = ?,
        name = ?,
        lastname = ?,
        phone_number = ?,
        role_id = ?,
        is_active = ?
        WHERE 
        id =?
    `,

    deleteRow:`
    UPDATE 
    user
    SET
    is_active =0
    WHERE 
    id=?
    `,
    
}

module.exports=usermodels;