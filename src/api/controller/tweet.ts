import { TweetInterface, TweetModel } from "../util/model";
import { MongooseUpdateQuery, Mongoose } from "mongoose";

import * as StoreTweet from '../store/tweet';
import { Payload } from "../util/service/secureAuth";

export const addTweet = async(
    payload: Payload,
    tweet: TweetInterface, 
) => {
    try {
        tweet.user = payload.sub
        await new TweetModel(tweet).validate();
        return await StoreTweet.addTweet(tweet);
    } catch (error) {
        throw { code: error.code, message: error.message }
    }
}

export const listTweets = async(
    payload: Payload,
    tweetId?: string
) => {
    try {
        if (!payload) {
            throw { code: 500, message: 'The token has invalid data'}
        }

        if (tweetId) {
            const tweetExists = (await StoreTweet.listTweets(null, { user: payload.sub, _id: tweetId }) as TweetInterface[])[0]
            if (!tweetExists) {
                throw { code: 404, message: `The tweet not exists` }
            }
            return tweetExists
        }
        return await StoreTweet.listTweets(null, { user: payload.sub }) as TweetInterface[]
        
    } catch (error) {
        throw { code: error.code, message: error.message }
    }
}

export const updateTweet = async(
    payload: Payload,
    tweetToUpdate: MongooseUpdateQuery<TweetInterface>,
    tweetId: string,
) => {
    try {
        if ( !Object.keys(tweetToUpdate).length || !tweetId) {
            throw { code: 400, message: `You don't send any data for the tweet or the tweet id` }
        }

        const tweetExists = await StoreTweet.updateTweet(tweetToUpdate, tweetId, { user: payload.sub })
        
        if (!tweetExists) {
            throw { code: 404, message: 'The tweet not exists' }
        }

        return tweetExists;

    } catch (error) {
        throw { code: error.code, message: error.message }
    }
}

export const deleteTweet = async(
    payload: Payload,
    tweetId: string,
) => {
    try {
        
        if (!tweetId) {
            throw { code: 400, message: `You don't send tweetId` }
        }

        const tweetExists = await StoreTweet.deleteTweet({ _id: tweetId, user: payload.sub })

        if (!tweetExists) {
            throw { code: 404, message: 'The tweet not exists' }
        }

        return tweetExists
        
    } catch (error) {
        throw { code: error.code, message: error.message }
    }
}