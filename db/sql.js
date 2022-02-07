module.exports =
    {
        signup: {
            getAll: 'select * from user',
            isUser: 'select user from user where userid=?',
        }
    }