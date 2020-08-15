import {
    UserInterface,
    FollowerInterface,
    TweetInterface,
    AuthInterface,
} from '../../util/model';

export type Commands =
    | 'LOGIN'
    | 'REGISTER'
    | 'ADD_TWEET'
    | 'DELETE_TWEET'
    | 'EDIT_TWEET'
    | 'VIEW_TWEETS'
    | 'FOLLOW'
    | 'UNFOLLOW'
    | 'PROFILE'
    | 'LIKE_TWEET'
    | 'DISLIKE_TWEET'
    | 'REPLY_TWEET'
    | 'RETWEET';
export type Collections =
    | UserInterface
    | FollowerInterface
    | TweetInterface
    | AuthInterface;
