import { Post } from '../../models/post';
import { User } from '../../models/user';
import pubsub from '../../utils/pubsub'
import { POST_CREATED } from '../../utils/event'

export const postResolvers = {
    Query: {
      getPosts: async () => await Post.find(),
      getPost: async (_: any, { id }: { id: string }) => await Post.findById(id),
    },
    Mutation: {
      createPost: async (_: any, { title, content, authorId }: { title: string, content: string, authorId: string }) => {
          const user = await User.findById(authorId);
          if (!user) {
            throw new Error('User not found');
          }
          const newPost = new Post({
            title,
            content,
            author: {
              userId: user.id,
              nickname: user.nickname,
              mannerTemperature: user.mannerTemperature,
              isVerified: user.isVerified,
            },
          });
          await newPost.save();
          const postObject = newPost.toObject({ getters: true });
          pubsub.publish(POST_CREATED, { postCreated: postObject });
          return newPost;
        },
      updatePost: async (_: any, { id, title, content, authorId }: { id: string, title?: string, content?: string, authorId?: string }) => {
          let author;
          if (authorId) {
            const user = await User.findById(authorId);
            if (!user) {
              throw new Error('User not found');
            }
            author = {
              userId: user.id,
              nickname: user.nickname,
              mannerTemperature: user.mannerTemperature,
              isVerified: user.isVerified,
            };
          }
          const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, content, author },
            { new: true }
          );
          return updatedPost;
        },
  
      deletePost: async (_: any, { id }: { id: string }) => {
          const deletedPost = await Post.findByIdAndDelete(id);
          return deletedPost;
      },
    },
    Subscription: {
        postCreated: {
          subscribe: () => pubsub.asyncIterator([POST_CREATED]),
        },
    }
  };