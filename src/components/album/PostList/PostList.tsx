import Box from '@mui/material/Box'

import PostListItem from '@/components/album/PostListItem/PostListItem'
import PostListItemSkeleton from '@/components/album/PostListItemSkeleton/PostListItemSkeleton'
import { usePostsData } from '@/hooks/useHttpAlbum'
import { usePostPageQueryParams } from '@/hooks/usePostPageQueryParams'

const PostList = () => {
  const { postPageQueryParams } = usePostPageQueryParams()
  const { isLoading, posts } = usePostsData({
    page: postPageQueryParams.page,
    qpCategoryId: postPageQueryParams.qpCategoryId
  })

  return (
    <Box className="__d-flex-center __d-flex-col">
      <Box
        className="__d-w-full __d-h-full __d-flex-center __d-flex-col"
        sx={{ pb: 5 }}
      >
        {isLoading && <PostListItemSkeleton />}

        {!isLoading &&
          posts.map((post) => <PostListItem key={post._id} post={post} />)}
      </Box>
    </Box>
  )
}

export default PostList
