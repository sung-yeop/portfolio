'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi, User } from '../lib/api'

export function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userApi.getUsers()
      return response.data
    },
  })

  if (isLoading) return <div className="p-4">사용자 목록을 불러오는 중...</div>
  if (error) return <div className="p-4 text-red-500">에러가 발생했습니다.</div>

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">사용자 목록</h2>
      <div className="grid gap-4">
        {users?.map((user: User) => (
          <div key={user.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">나이: {user.age}세</p>
          </div>
        ))}
      </div>
    </div>
  )
}