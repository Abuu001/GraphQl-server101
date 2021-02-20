
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

//================================DUMMY DATA================================
const authors=[
    {id: 1 , name : 'Julia'},
    {id: 2 , name : 'Ken'},
    {id: 3 , name : 'Ben'},
    {id: 4 , name : 'Tim'},  
    {id: 5 , name : 'Bill'}
]

const books =[
    { id: 1 ,name : "Lost Kid" ,authorID :1 },
    { id: 2 ,name : "The rain" ,authorID :1 },
    { id: 3 ,name : "The 2 dwarfs" ,authorID :2 },
    { id: 4 ,name : "The turtle in the sea" ,authorID :2 },
    { id: 5 ,name : "The fastest car" ,authorID :3 },
    { id: 6 ,name : "Mr incredible" ,authorID :1 },
    { id: 7 ,name : "Gurdians of the sea" ,authorID :3 },
]
//===========================================================================
const query1 = new GraphQLObjectType({
    name : 'HelloWorld',
    fields:()=>({
        message : { 
            type : GraphQLString ,
            resolve : (parent,args)=>console.log('HEY world')
        }
    })
})

const BookType =new GraphQLObjectType({
    name : 'Book',
    description : 'This is a book written  by an author',
    fields : ()=>({
        id : { type : new GraphQLNonNull(GraphQLInt)},
        name : {type :new GraphQLNonNull(GraphQLString)},
        authorID : {type : new GraphQLNonNull(GraphQLInt)},
        author : {
            type : AuthorType,
            resolve : (parent,args)=>{
                return authors.find(author=>author.id === parent.authorID)
            }
        }
    })
})

const AuthorType =new GraphQLObjectType({
    name : 'Author',
    description : 'This is  an author',
    fields : ()=>({
        id : { type : new GraphQLNonNull(GraphQLInt)},
        name : {type :new GraphQLNonNull(GraphQLString)},
        books :{
            type : new GraphQLList(BookType),
            resolve : (parent,args)=>{
                    return books.filter(book => book.authorID === parent.id)
            }
        } 
    })
})

const RootQuery = new GraphQLObjectType({
    name : 'RootQuery',
    fields:{
        query1 :{
            type : query1,
            resolve(parent,args){
                console.log("me");
            }
        },
        books : {
            type : new GraphQLList(BookType),
            description: "List of books",
            resolve : ()=>books         //code to get data from db /other source
        },
        authors:{
            type :  new GraphQLList(AuthorType),
            description : "List of authors",
            resolve: ()=> authors
        },
        book : {
            type :  BookType,
            description: "A single  book",
            args:{
                id : {type : GraphQLInt}
            },
            resolve : (parent,args)=>books.find(book=>book.id === args.id)         //code to get data from db /other source
        },
        author:{
            type :  AuthorType,
            description : "Single author",
            args:{
                id : {type : GraphQLInt}
            },
            resolve: (parent,args)=> authors.find(author=>author.id === args.id)
        }
    }
})

const RootMutationType= new GraphQLObjectType({
    name : 'Mutation',
    description:'Root mutation',
    fields:()=>({
        addBook : {
            type : BookType,
            description : "Add Book",
            args:{
                name : { type : new GraphQLNonNull(GraphQLString)},
                authorID : { type : new GraphQLNonNull(GraphQLInt)}
            },
            resolve : (parent,args)=>{
                const book = { id : books.length +1 ,name : args.name ,authorID : args.authorID}
                books.push(book)
                return book;
            }
        },
        addAuthor : {
            type : AuthorType,
            description : "Add Author",
            args:{
                name : { type : new GraphQLNonNull(GraphQLString)}
            },
            resolve : (parent,args)=>{
                const author = { id : authors.length +1 ,name : args.name }
                authors.push(author)
                return author;
            }
        }
    })
})

module.exports= new GraphQLSchema({
    query : RootQuery,
    mutation : RootMutationType  // helps us define our post put delete
})