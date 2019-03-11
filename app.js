const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const app = express();
app.use(bodyParser.json());
const mongoose = require('mongoose');
const graphQlSchema = require('./graphql/schema')
const graphQlResolvers = require('./graphql/resolvers');
const isAuth = require('./middlewares/auth.middleware');
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    if(req.method === 'OPTIONS'){
        res.sendStatus(200);
        return
    }
    next()
})
app.use(isAuth);
app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

mongoose.connect(`mongodb://harish_gql:harish123@ds139534.mlab.com:39534/utilities`, { useNewUrlParser: true })
// mongoose.connect(`mongodb://localhost:27017/graphql`, { useNewUrlParser: true })
    .then(() => {
        app.listen(3001, () => {
            console.log('im listening on 3000')
        });
    }).catch(error => {
        // console.log(`mongodb://${process.env.MONGO_USER}:${process.env.PWD}@ds139534.mlab.com:39534/utilities`)
        console.log(error)
    });
