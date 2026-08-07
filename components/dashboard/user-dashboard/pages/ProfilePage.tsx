'use client'

import React, { useState, useEffect } from 'react'
import { updateUserApi } from '@/api/users-api'
import { useAtom } from 'jotai'
import { tokenAtom } from '@/utils/user'
import { Users } from '@/utils/type'
import {
  User as UserIcon,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Pencil,
  CheckCircle2,
  XCircle,
  Building2,
  Globe2,
} from 'lucide-react'

type ProfilePageProps = {
  user: Users | null
  onUserUpdate?: (updatedUser: Users) => void
  onRefresh?: () => void
}

// Kept outside the component so it isn't re-created on every render (prevents focus loss)
type InfoFieldProps = {
  label: string
  name?: keyof Users
  value: React.ReactNode
  icon: React.ReactNode
  editable?: boolean
  type?: string
  isEditing: boolean
  formData: Partial<Users>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  name,
  value,
  icon,
  editable = true,
  type = 'text',
  isEditing,
  formData,
  onChange,
}) => (
  <div className="flex gap-3">
    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-gray-400 text-xs font-medium mb-0.5">{label}</p>
      {isEditing && editable && name ? (
        <input
          type={type}
          name={name}
          value={(formData[name] as string) ?? ''}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      ) : (
        <p className="text-gray-800 font-medium text-sm sm:text-[15px] break-words">
          {value || <span className="text-gray-300 font-normal">Not provided</span>}
        </p>
      )}
    </div>
  </div>
)

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUserUpdate, onRefresh }) => {
  const [token] = useAtom(tokenAtom)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Users>>(user || {})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFormData(user)
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData(user || {})
    setMessage(null)
  }

  const handleSave = async () => {
    if (!formData?.userId || !token) return

    if (formData.email && !isValidEmail(formData.email)) {
      setMessage('error:Please enter a valid email address.')
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const updateData = {
        fullName: formData.fullName || null,
        email: formData.email || null,
        phone: formData.phone || null,
        street: formData.street || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        postalCode: formData.postalCode || null,
      }

      const res = await updateUserApi(token, formData.userId, updateData)

      if (res?.data) {
        setMessage('success:Profile updated successfully!')
        setIsEditing(false)

        if (onRefresh) {
          await onRefresh()
        } else if (onUserUpdate) {
          onUserUpdate(res.data)
        }

        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error: any) {
      console.error('Update error:', error)
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update profile. Please try again.'
      setMessage(`error:${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user || !formData || Object.keys(formData).length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10 text-sm sm:text-base">
        No user info found.
      </p>
    )
  }

  const isSuccess = message?.startsWith('success:')
  const messageText = message?.replace(/^(success|error):/, '')

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">My Profile</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your personal information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors font-medium text-white text-sm shadow-sm"
          >
            <Pencil size={14} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
        {/* Avatar + Name */}
        <div className="px-4 sm:px-8 py-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold flex-shrink-0 shadow-sm">
                {(formData.fullName ?? formData.username)?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {formData.fullName ?? 'N/A'}
                </h2>
                <p className="text-gray-400 text-sm">@{formData.username}</p>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-medium ${
                formData.active
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {formData.active ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
              {formData.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-4 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <InfoField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              icon={<UserIcon size={16} />}
              isEditing={isEditing}
              formData={formData}
              onChange={handleChange}
            />
            <InfoField
              label="Email"
              name="email"
              value={formData.email}
              icon={<Mail size={16} />}
              type="email"
              isEditing={isEditing}
              formData={formData}
              onChange={handleChange}
            />
            <InfoField
              label="Phone"
              name="phone"
              value={formData.phone}
              icon={<Phone size={16} />}
              isEditing={isEditing}
              formData={formData}
              onChange={handleChange}
            />
            <InfoField
              label="Member Since"
              value={
                formData.createdAt
                  ? new Date(formData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'
              }
              icon={<Calendar size={16} />}
              editable={false}
              isEditing={isEditing}
              formData={formData}
              onChange={handleChange}
            />
            <InfoField
              label="Street"
              name="street"
              value={formData.street}
              icon={<MapPin size={16} />}
              isEditing={isEditing}
              formData={formData}
              onChange={handleChange}
            />
            <InfoField
              label="City"
              name="city"
              value={formData.city}
              icon={<Building2 size={16} />}
              isEditing={isEditing}
              formData={formData}
              onChange={handleChange}
            />
            <InfoField
              label="State"
              name="state"
              value={formData.state}
              icon={<MapPin size={16} />}
              isEditing={isEditing}
              formData={formData}
              onChange={handleChange}
            />
            <InfoField
              label="Country"
              name="country"
              value={formData.country}
              icon={<Globe2 size={16} />}
              isEditing={isEditing}
              formData={formData}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Footer Actions */}
        {isEditing && (
          <div className="bg-gray-50 border-t border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition-colors font-medium text-gray-700 text-sm disabled:opacity-50 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors font-medium text-white text-sm disabled:opacity-50 order-1 sm:order-2 shadow-sm"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Mobile Edit Button */}
        {!isEditing && (
          <div className="sm:hidden p-4 border-t border-gray-100">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors font-medium text-white text-sm shadow-sm"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          </div>
        )}

        {message && (
          <div
            className={`text-center py-2.5 text-xs sm:text-sm font-medium ${
              isSuccess ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
            }`}
          >
            {messageText}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage














