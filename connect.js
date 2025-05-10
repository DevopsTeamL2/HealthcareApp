import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
dotenv.config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

run();
