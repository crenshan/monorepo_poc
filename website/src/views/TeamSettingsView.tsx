import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { Avatar, Card, Input, Select, useToast } from '@mono/ui'
import type { SelectOption } from '@mono/ui'

import './TeamSettingsView.css'

interface TeamMember {
  id: string
  name: string
  role: string
  lastActive: string
}

const roleOptions: SelectOption[] = [
  { value: 'Owner', label: 'Owner' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Member', label: 'Member' },
  { value: 'Viewer', label: 'Viewer' },
]

const initialMembers: TeamMember[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Owner', lastActive: '2 hours ago' },
  { id: '2', name: 'Alan Turing', role: 'Admin', lastActive: 'Yesterday' },
  { id: '3', name: 'Grace Hopper', role: 'Member', lastActive: '3 days ago' },
  { id: '4', name: 'Katherine Johnson', role: 'Member', lastActive: '1 week ago' },
  { id: '5', name: 'Margaret Hamilton', role: 'Admin', lastActive: '5 minutes ago' },
  { id: '6', name: 'Radia Perlman', role: 'Viewer', lastActive: '3 weeks ago' },
]

export function TeamSettingsView() {
  const { toast } = useToast()
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [query, setQuery] = useState('')

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleRoleChange = (member: TeamMember) => (event: ChangeEvent<HTMLSelectElement>) => {
    const role = event.target.value
    setMembers((prevMembers) => prevMembers.map((m) => (m.id === member.id ? { ...m, role } : m)))
    toast({ description: `Updated ${member.name}'s role to ${role}`, variant: 'success' })
  }

  const filteredMembers = members.filter((member) => {
    const search = query.trim().toLowerCase()
    if (!search) return true
    return member.name.toLowerCase().includes(search) || member.role.toLowerCase().includes(search)
  })

  return (
    <div className="team-settings">
      <div className="team-settings__header">
        <h2>Team settings</h2>
        <p>Manage who has access to your team and what they can do.</p>
      </div>

      <div className="team-settings__toolbar">
        <Input
          label="Search members"
          placeholder="Search by name or role"
          value={query}
          onChange={handleSearchChange}
        />
      </div>

      <Card>
        {filteredMembers.length === 0 ? (
          <div className="team-settings__empty">
            <h3>No team members found</h3>
            <p>
              {members.length === 0
                ? 'You haven’t added anyone to this team yet.'
                : `No members match "${query}". Try a different search term.`}
            </p>
          </div>
        ) : (
          <table className="team-settings__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Last active</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="team-settings__member">
                      <Avatar name={member.name} size="sm" />
                      <span>{member.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="team-settings__role">
                      <Select
                        label={<span className="team-settings__sr-only">Change role for {member.name}</span>}
                        value={member.role}
                        onChange={handleRoleChange(member)}
                        options={roleOptions}
                      />
                    </div>
                  </td>
                  <td>{member.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
