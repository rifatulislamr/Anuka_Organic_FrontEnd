'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { getUsers } from '@/api/users-api'
import { Users } from '@/utils/type'
import Loader from '@/utils/loader'

interface UsersPageProps {
  token: string
}

const UsersPage: React.FC<UsersPageProps> = ({ token }) => {
  const [users, setUsers] = useState<Users[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Users[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getUsers(token)
      setUsers(res.data || [])
      setFilteredUsers(res.data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(term) ||
        (u.fullName?.toLowerCase().includes(term) ?? false) ||
        (u.roleName?.toLowerCase().includes(term) ?? false) ||
        u.email.toLowerCase().includes(term)
    )
    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [searchTerm, users])

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const currentUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage)

  const StatusBadge = ({ active }: { active: boolean }) => (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
        active
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  )

  const RoleBadge = ({ role }: { role?: string }) => (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
        role?.toLowerCase() === 'admin'
          ? 'bg-emerald-50 text-emerald-700'
          : role?.toLowerCase() === 'user'
          ? 'bg-blue-50 text-blue-700'
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      {role || 'User'}
    </span>
  )

  return (
    <section className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Manage Users
        </h1>
        <input
          type="text"
          placeholder="Search users..."
          className="border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-72 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <Loader />
        ) : currentUsers.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm">
            No users found
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="p-4 text-left">User</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Mobile</th>
                    <th className="p-4 text-left">Address</th>
                    <th className="p-4 text-left">Role</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr
                      key={user.userId}
                      className={`border-t border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                      }`}
                    >
                      <td className="p-4">
                        <p className="font-medium text-gray-800 capitalize">
                          {user.fullName || user.username}
                        </p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </td>
                      <td className="p-4 text-gray-700">{user.email}</td>
                      <td className="p-4 text-gray-700">{user.phone}</td>
                      <td className="p-4 text-gray-700 max-w-[220px] truncate">
                        {user.street} {user.state} {user.city} {user.country}
                      </td>
                      <td className="p-4">
                        <RoleBadge role={user.roleName} />
                      </td>
                      <td className="p-4">
                        <StatusBadge active={user.active} />
                      </td>
                      <td className="p-4 text-gray-500 text-xs">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
              {currentUsers.map((user) => (
                <div key={user.userId} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-800 capitalize">
                        {user.fullName || user.username}
                      </p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                    <StatusBadge active={user.active} />
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="text-gray-400">Email: </span>
                      {user.email}
                    </p>
                    <p>
                      <span className="text-gray-400">Mobile: </span>
                      {user.phone}
                    </p>
                    <p>
                      <span className="text-gray-400">Address: </span>
                      {user.street} {user.state} {user.city} {user.country}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <RoleBadge role={user.roleName} />
                    <span className="text-xs text-gray-400">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-1.5 p-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  currentPage === i + 1
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default UsersPage










