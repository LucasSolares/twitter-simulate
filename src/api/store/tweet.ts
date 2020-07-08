import { TweetModel, TweetInterface } from "../util/model";
import { Validation } from "../util/interfaces/validation";
import {
    DocumentQuery,
    MongooseFilterQuery,
    MongooseUpdateQuery,
} from "mongoose";

export const addTweet = async (
    tweet: TweetInterface,
    validation: Validation = {
        condition: true,
        error: { code: 500, message: "Internal Server Error" },
    }
) => {
    try {
        if (!validation.condition) {
            throw validation.error;
        }
        return new TweetModel(tweet).save();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const listTweets = async (
    tweetId?: string,
    specialQuery: MongooseFilterQuery<TweetInterface> = {},
    toPopulates?: string[]
) => {
    try {
        let queryToExecute: DocumentQuery<
            TweetInterface[] | TweetInterface,
            TweetInterface
        >;

        if (tweetId) {
            queryToExecute = TweetModel.findOne({ _id: tweetId });
        } else {
            queryToExecute = TweetModel.find(specialQuery);
        }
        if (toPopulates) {
            for (const toPopulate of toPopulates) {
                queryToExecute = queryToExecute.populate(toPopulate);
            }
        }

        return await queryToExecute.exec();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const updateTweet = async (
    tweetToUpdate: MongooseUpdateQuery<TweetInterface>,
    tweetId?: string,
    query?: MongooseFilterQuery<TweetInterface>
) => {
    try {
        let queryToExecute: DocumentQuery<
            TweetInterface[] | TweetInterface,
            TweetInterface
        >;
        if (!tweetId && !query) {
            throw { code: 400, message: `You don't send an userId or query` };
        }

        if (tweetId) {
            queryToExecute = TweetModel.findByIdAndUpdate(
                tweetId,
                tweetToUpdate,
                { new: true }
            );
        } else {
            queryToExecute = TweetModel.updateMany(query, tweetToUpdate);
        }
        return await queryToExecute.exec();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const deleteTweet = async (
    queryWithId?: MongooseFilterQuery<TweetInterface>,
    query?: MongooseFilterQuery<TweetInterface>
) => {
    try {
        let queryToExecute: DocumentQuery<TweetInterface, TweetInterface>;
        if (!queryWithId && !query) {
            throw { code: 400, message: `You don't send an userId or query` };
        }

        if (queryWithId) {
            queryToExecute = TweetModel.findOneAndDelete(queryWithId);
        } else {
            return await TweetModel.deleteMany(query);
        }

        return await queryToExecute.exec();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};
