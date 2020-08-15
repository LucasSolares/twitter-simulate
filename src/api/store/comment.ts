import { CommentInterface, CommentModel } from '../util/model';

export const addComment = async (
    commentToAdd: CommentInterface,
) => {
    try {
        await new CommentModel(commentToAdd).save();
        return await CommentModel.find({ relatedTo: commentToAdd.relatedTo });
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const listComments = async (tweetId: string) => {
    try {
        return await CommentModel.find({ relatedTo: tweetId });
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};