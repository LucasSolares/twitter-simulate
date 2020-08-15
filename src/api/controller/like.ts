import {  LikeInterface, LikeModel, TweetInterface } from '../util/model';
import { MongooseUpdateQuery, Mongoose } from 'mongoose';

import * as StoreLike from '../store/like';
import * as StoreFollower from '../store/follower';
import * as StoreTweet from '../store/tweet';
import { Payload } from '../util/service/secureAuth';
import { Follower } from '../util/model/follower';

export const addLike = async (payload: Payload, like: Partial<LikeInterface>) => {
    try {
        like.createdBy = payload.sub;
        await new LikeModel(like).validate();
        const tweetForLike = await StoreTweet.listTweets(like.relatedTo) as TweetInterface;
        if (!tweetForLike) {
          throw { code: 400, message: 'That tweet not exists' }
        }
        const areYouFollower = (await StoreFollower.listFollowers(null, { follower: payload.sub, userFollowed: tweetForLike.user })) as Follower[]
        if (areYouFollower.length === 0) {
          throw { code: 401, message: 'You are not following this user or the user are you' };
        }
        return await StoreLike.addLike(like as LikeInterface);
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};


export const deleteLike = async (payload: Payload, tweetId: string) => {
    try {
        if (!tweetId) {
            throw { code: 400, message: `You don't send tweetId` };
        }

        const likeExists = await LikeModel.findOne({ createdBy: payload.sub, relatedTo: tweetId });

        if (!likeExists) {
          throw { code: 404, message: 'The not already like this tweet' };
        }

        await StoreLike.deleteLike(tweetId, payload.sub)

        return likeExists;
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};
