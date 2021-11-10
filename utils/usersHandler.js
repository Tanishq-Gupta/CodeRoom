const users = [];

const joinUser = (id, userName, roomId) => {
    const user = { id, userName, roomId };
    users.push(user);
    return user;
};

const getUserById = (id) => {
    const arr = users.filter((user) => {
        return user.id === id;
    });
    console.log(arr);
    return users.filter((user) => {
        return user.id === id;
    })[0];
};

const removeUserById = (id) => {
    console.log("in remove users before removing ", users);
    const index = users.findIndex((user) => user.id === id);
    console.log(users, id, index);
    if (index === -1) {
        console.log("Something went wrong");
        return;
    }
    const userRemoved = users[index];
    users.splice(index, 1);
    return userRemoved;
};

module.exports = {
    joinUser,
    getUserById,
    removeUserById,
};
