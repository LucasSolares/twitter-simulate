import { LikeModel, LikeInterface } from '../util/model';

export const addLike = async (
    likeToAdd: LikeInterface,
) => {
    try {
        const likeAlreadyDo = await LikeModel.findOne({ relatedTo: likeToAdd.relatedTo, createdBy: likeToAdd.createdBy });
        if (likeAlreadyDo) {
          throw { code: 400, message: 'You already like this tweet' }
        }
        return new LikeModel(likeToAdd).save();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const listLikes = async (tweetId: string) => {
    try {
        return await LikeModel.find({ relatedTo: tweetId });
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};


export const deleteLike = async (
    tweetId: string,
    userId: string
) => {
    try {
        const likeToDelete = await LikeModel.findOne({ relatedTo: tweetId, createdBy: userId });
        if (!likeToDelete) {
          throw { code: 400, message: 'You not like this tweet'}
        }
        await LikeModel.deleteOne({ relatedTo: tweetId, createdBy: userId })
        return likeToDelete;
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};
