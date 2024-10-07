import { MongoClient } from "mongodb";

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
    var mongoose: {
        Schema: any; conn: Mongoose | null, promise: Promise<Mongoose> | null 
};
    var _io: SocketIOServer | undefined;
}

export {};