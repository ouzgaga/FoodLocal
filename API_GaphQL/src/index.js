const { GraphQLServer } = require('graphql-yoga');

// 2
const links = [
  {
    id         : 'link-0',
    url        : 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  }
];

let idCount = links.length;
const resolvers = {
  Query   : {
    info: () => 'This is the API of a Hackernews Clone',
    feed: () => links,
    link: (root, args) => links[args.id]
  },
  Mutation: {
    // 2
    post      : (root, args) => {
      const link = {
        id         : idCount++,
        description: args.description,
        url        : args.url
      };
      links.push(link);
      return link;
    },
    updateLink: (root, args) => {
      const link = links[args.id];
      link.description = args.description;
      link.url = args.url;
      return link;
    },
    deleteLink: (root, args) => {
      const link = links[args.id];
      links.splice(args.id, 1);
      return link;
    }
  },
  Link    : {
    id         : root => root.id,
    description: root => root.description,
    url        : root => root.url
  }
};

// 3
const server = new GraphQLServer(
  {
    typeDefs: './src/schema.graphql',
    resolvers
  }
);
server.start(() => console.log('Server is running on http://localhost:4000'));
