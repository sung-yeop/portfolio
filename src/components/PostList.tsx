'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { postApi, Post } from '../lib/api'

export function PostList() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const queryClient = useQueryClient()

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await postApi.getPosts()
      return response.data
    },
  })

  const createPostMutation = useMutation({
    mutationFn: (newPost: Omit<Post, 'id'>) => postApi.createPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setTitle('')
      setBody('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && body.trim()) {
      createPostMutation.mutate({
        title,
        body,
        userId: 1,
      })
    }
  }

  if (isLoading) return <div className='p-4'>게시글 목록을 불러오는 중...</div>
  if (error) return <div className='p-4 text-red-500'>에러가 발생했습니다.</div>

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>게시글 목록</h2>

      <form onSubmit={handleSubmit} className='mb-6 p-4 border rounded-lg'>
        <h3 className='text-lg font-semibold mb-2'>새 게시글 작성</h3>
        <div className='mb-3'>
          <input
            type='text'
            placeholder='제목을 입력하세요'
            value={title}
            onChange={e => setTitle(e.target.value)}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-3'>
          <textarea
            placeholder='내용을 입력하세요'
            value={body}
            onChange={e => setBody(e.target.value)}
            className='w-full p-2 border rounded h-24'
          />
        </div>
        <button
          type='submit'
          disabled={createPostMutation.isPending}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50'
        >
          {createPostMutation.isPending ? '작성 중...' : '게시글 작성'}
        </button>
      </form>

      <div className='grid gap-4'>
        {posts?.map((post: Post) => (
          <div key={post.id} className='border p-4 rounded-lg'>
            <h3 className='font-semibold text-lg mb-2'>{post.title}</h3>
            <p className='text-gray-700 mb-2'>{post.body}</p>
            <p className='text-sm text-gray-500'>작성자 ID: {post.userId}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
