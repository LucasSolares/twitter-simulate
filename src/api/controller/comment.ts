import {
    LikeInterface,
    LikeModel,
    TweetInterface,
    CommentInterface,
    CommentModel,
} from '../util/model';
import { MongooseUpdateQuery, Mongoose } from 'mongoose';

import * as StoreComment from '../store/comment';
import * as StoreFollower from '../store/follower';
import * as StoreTweet from '../store/tweet';
import { Payload } from '../util/service/secureAuth';
import { Follower } from '../util/model/follower';

export const addComment = async (
    payload: Payload,
    comment: Partial<CommentInterface>
) => {
    try {
        comment.createdBy = payload.sub;
        await new CommentModel(comment).validate();
        const tweetForComment = (await StoreTweet.listTweets(
            comment.relatedTo
        )) as TweetInterface;
        if (!tweetForComment) {
            throw { code: 400, message: 'That tweet not exists' };
        }
        return await StoreComment.addComment(comment as CommentInterface);
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const listComments = async (tweetId: string) => {
    try {
        if (!tweetId) {
            throw { code: 400, message: `You don't send tweetId` };
        }

        return await StoreComment.listComments(tweetId);
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};
