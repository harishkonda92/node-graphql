const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const app = express();
app.use(bodyParser.json());
const mongoose = require('mongoose');
const graphQlSchema = require('./graphql/schema')
const graphQlResolvers = require('./graphql/resolvers');
app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

mongoose.connect(`mongodb://localhost:27017/graphql`, { useNewUrlParser: true })
    .then(() => {
        app.listen(3000, () => {
            console.log('im listening on 3000')
        });
    }).catch(error => {
        // console.log(`mongodb://${process.env.MONGO_USER}:${process.env.PWD}@ds139534.mlab.com:39534/utilities`)
        console.log(error)
    });
