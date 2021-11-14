const fs = require('fs');

const showAllUser = () => {
    const data=fs.readFileSync('./Users.json');
    return JSON.parse(data.toString());
}

const addNewUser = async (name,email,password,cash,credit,id,acountId) => {
    const file = await showAllUser()
    console.log(file)
    const user = file.users.find(user => user.id === id);
    if (user) {
        return false;
    } else {
         file.users.push({
            id,
            name,
            email,
            password,
            cash,
            credit,
            acountId
        });

        fs.writeFile('./Users.json', JSON.stringify(file), (err) => {
            if (err) {
                console.log(err);
            }
        });
        return true
    }
}


// const deleteUserById = async (id) => {
//     const file = await showAllUser()
//     const user = file.users.filter(user => user.id !== id);
//     file.users = user
//     fs.writeFile('./Users.json', JSON.stringify(file), (err) => {
//         if (err) {
//             console.log(err);
//         }
//     });

// }

module.exports = {
    showAllUser,
    addNewUser,
    // deleteUserById

}