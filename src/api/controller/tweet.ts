import { TweetInterface, TweetModel, UserInterface, AuthInterface } from '../util/model';
import { MongooseUpdateQuery, Mongoose } from 'mongoose';

import * as StoreTweet from '../store/tweet';
import * as StoreLike from '../store/like';
import * as StoreUser from '../store/user';
import * as StoreAuth from '../store/auth';
import * as StoreComment from '../store/comment';
import { Payload } from '../util/service/secureAuth';

export const addTweet = async (payload: Payload, tweet: Partial<TweetInterface>, isRetweet?: boolean) => {
    try {
        const credentialToFindUser = await StoreAuth.listAuth(payload.sub) as AuthInterface;
        const userToAddTweet = await StoreUser.listUsers(credentialToFindUser.user) as UserInterface;
        if (!isRetweet && !tweet.content) {
            throw { code: 400, message: 'You dont send any content for the tweet' }
        }
        if (isRetweet) {
            const tweetToRetweet = await StoreTweet.listTweets(tweet.relatedTo) as TweetInterface;
            if (!tweetToRetweet) {
                throw {code: 400, message: 'The tweet to retweet not exists'}
            }
            const alreadyExistsARetweet = await StoreTweet.listTweets(null, { relatedTo: tweet.relatedTo, user: userToAddTweet._id }) as TweetInterface[];

            if (alreadyExistsARetweet.length !== 0) {
                await StoreTweet.deleteTweet({ _id: alreadyExistsARetweet.pop()._id})
                return 'You already retweet to this tweet and the retweet was eliminated' 
            }
        }
        tweet.content = tweet.content || '';
        tweet.user = userToAddTweet._id;
        await new TweetModel(tweet).validate();
        return await StoreTweet.addTweet(tweet as TweetInterface);
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const listTweets = async (payload: Payload, email?: string) => {
    try {
        const tweetsStructured = [];
        if (!payload) {
            throw { code: 500, message: 'The token has invalid data' };
        }

        const credentialOfUser = await StoreAuth.listAuth(null, { email }) as AuthInterface[];

        if (credentialOfUser.length === 0) {
            console.error('Credentials not finded')
            throw { code: 400, message: 'An error ocurred' }
        }

        const userToFindTweets = await StoreUser.listUsers(credentialOfUser.pop().user) as UserInterface;
        const tweetsOfUser = (await StoreTweet.listTweets(
            null,
            {
                user: userToFindTweets._id
            },
            ['user', 'relatedTo']
        )) as TweetInterface[];
        for (const tweet of tweetsOfUser) {
            const likes = await StoreLike.listLikes(tweet._id);
            const replies = await StoreComment.listComments(tweet._id);
            tweetsStructured.push({
                _id: tweet._id,
                content: tweet.content,
                user: tweet.user,
                relatedTo: tweet.relatedTo,
                createdAt: tweet.createdAt,
                likes,
                replies
            });
        }
        return tweetsStructured;
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const updateTweet = async (
    payload: Payload,
    tweetToUpdate: MongooseUpdateQuery<TweetInterface>,
    tweetId: string
) => {
    try {
        if (!Object.keys(tweetToUpdate).length || !tweetId) {
            throw {
                code: 400,
                message: `You don't send any data for the tweet or the tweet id`,
            };
        }

        const tweetExists = await StoreTweet.updateTweet(
            tweetToUpdate,
            tweetId,
            { user: payload.sub }
        );

        if (!tweetExists) {
            throw { code: 404, message: 'The tweet not exists' };
        }

        return tweetExists;
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const deleteTweet = async (payload: Payload, tweetId: string) => {
    try {
        if (!tweetId) {
            throw { code: 400, message: `You don't send tweetId` };
        }

        const tweetExists = await StoreTweet.deleteTweet({
            _id: tweetId,
            user: payload.sub,
        });

        if (!tweetExists) {
            throw { code: 404, message: 'The tweet not exists' };
        }

        return tweetExists;
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};
