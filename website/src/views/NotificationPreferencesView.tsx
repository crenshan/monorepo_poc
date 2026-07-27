import { useState } from 'react'
import { Button, Card, Select, useToast } from '@mono/ui'
import type { SelectOption } from '@mono/ui'

import './NotificationPreferencesView.css'

type Channel = 'email' | 'push' | 'sms'

interface Category {
  id: string
  label: string
  description: string
}

const channels: { id: Channel; label: string }[] = [
  { id: 'email', label: 'Email' },
  { id: 'push', label: 'Push' },
  { id: 'sms', label: 'SMS' },
]

const categories: Category[] = [
  {
    id: 'security',
    label: 'Security alerts',
    description: 'Sign-ins, password changes, and suspicious activity',
  },
  {
    id: 'billing',
    label: 'Billing',
    description: 'Invoices, payment failures, and plan changes',
  },
  {
    id: 'product',
    label: 'Product updates',
    description: 'New features, improvements, and announcements',
  },
  {
    id: 'comments',
    label: 'Comments & mentions',
    description: 'When someone mentions you or replies to your comment',
  },
  {
    id: 'digest',
    label: 'Weekly digest',
    description: 'A summary of activity from the past week',
  },
]

const digestFrequencyOptions: SelectOption[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'never', label: 'Never' },
]

type Preferences = Record<string, Record<Channel, boolean>>

const initialPreferences: Preferences = {
  security: { email: true, push: true, sms: true },
  billing: { email: true, push: false, sms: false },
  product: { email: true, push: false, sms: false },
  comments: { email: true, push: true, sms: false },
  digest: { email: true, push: false, sms: false },
}

export function NotificationPreferencesView() {
  const { toast } = useToast()
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences)
  const [digestFrequency, setDigestFrequency] = useState('weekly')

  const handleToggle = (categoryId: string, channel: Channel) => {
    setPreferences((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [channel]: !prev[categoryId][channel],
      },
    }))
  }

  const handleSave = () => {
    toast({ description: 'Notification preferences saved', variant: 'success' })
  }

  return (
    <div className="notification-preferences">
      <div className="notification-preferences__header">
        <h2>Notification preferences</h2>
        <p>Choose how you want to be notified for each type of activity.</p>
      </div>

      <Card>
        <table className="notification-preferences__table">
          <thead>
            <tr>
              <th>Notification</th>
              {channels.map((channel) => (
                <th key={channel.id} className="notification-preferences__channel-head">
                  {channel.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  <div className="notification-preferences__category">
                    <span className="notification-preferences__category-label">{category.label}</span>
                    <span className="notification-preferences__category-description">
                      {category.description}
                    </span>
                  </div>
                </td>
                {channels.map((channel) => {
                  const inputId = `notif-${category.id}-${channel.id}`
                  return (
                    <td key={channel.id} className="notification-preferences__toggle-cell">
                      <input
                        id={inputId}
                        type="checkbox"
                        className="notification-preferences__checkbox"
                        checked={preferences[category.id][channel.id]}
                        onChange={() => handleToggle(category.id, channel.id)}
                      />
                      <label className="notification-preferences__sr-only" htmlFor={inputId}>
                        {channel.label} notifications for {category.label}
                      </label>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <div className="notification-preferences__digest">
          <div className="notification-preferences__digest-select">
            <Select
              label="Digest email frequency"
              value={digestFrequency}
              onChange={(event) => setDigestFrequency(event.target.value)}
              options={digestFrequencyOptions}
              disabled={!preferences.digest.email}
            />
          </div>
          {!preferences.digest.email && (
            <p className="notification-preferences__digest-hint">
              Enable email notifications for the weekly digest to choose a frequency.
            </p>
          )}
        </div>
      </Card>

      <div className="notification-preferences__actions">
        <Button onClick={handleSave}>Save preferences</Button>
      </div>
    </div>
  )
}
