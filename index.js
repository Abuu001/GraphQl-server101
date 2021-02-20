const express= require('express');
const app = express();
const morgan = require('morgan');
const {graphqlHTTP}= require('express-graphql');
const graphQLSchema = require('./schema/graphQlSchema');

//middleware
app.use(morgan('dev'));
app.use(express.json())
app.use('/graphql',graphqlHTTP({
    schema : graphQLSchema,
    graphiql:true
}))

const PORT = 3007;
app.listen(PORT,console.log(`Server is running in port ${PORT}`));
