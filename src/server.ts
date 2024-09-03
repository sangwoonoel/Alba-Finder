import { ApolloServer } from '@apollo/server';
import { connectToMongoDB } from './database';
import { typeDefs, resolvers } from './graphql/graphql.index';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import cors from 'cors';

export async function startServer(port: number) {
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const app = express();
    const httpServer = createServer(app);

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/subscriptions',
    });
    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();
    app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server));

    httpServer.listen(port, () => {
        console.log(`Server is now running on http://localhost:${port}/graphql`);
        console.log(`WebSocket server is running on ws://localhost:${port}/subscriptions`);
    });

    await connectToMongoDB();
}
