import { useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  Avatar,
  Card,
  Input,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  useToast,
} from '@mono/ui'

import './TeamSettingsView.css'

type Role = 'admin' | 'editor' | 'viewer'

interface Member {
  id: string
  name: string
  role: Role
  lastActive: string
}

const roleOptions: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

const roleLabel: Record<Role, string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}

const initialMembers: Member[] = [
  { id: '1', name: 'Ada Lovelace', role: 'admin', lastActive: '2 hours ago' },
  { id: '2', name: 'Grace Hopper', role: 'editor', lastActive: 'Yesterday' },
  { id: '3', name: 'Alan Turing', role: 'viewer', lastActive: '3 days ago' },
  { id: '4', name: 'Katherine Johnson', role: 'editor', lastActive: '1 week ago' },
]

export function TeamSettingsView() {
  const { toast } = useToast()
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [query, setQuery] = useState('')

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleRoleChange = (member: Member, role: Role) => {
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, role } : m)))
    toast({ description: `${member.name} is now ${roleLabel[role]}`, variant: 'success' })
  }

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <div className="team-settings-view">
      <div className="team-settings-view__header">
        <h2>Team settings</h2>
        <div className="team-settings-view__search">
          <Input
            label="Search members"
            placeholder="Search by name"
            value={query}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <Card className="team-settings-view__empty">
          <p>
            {members.length === 0
              ? 'No team members yet.'
              : `No members match "${query}".`}
          </p>
        </Card>
      ) : (
        <Table aria-label="Team members">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Last active</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="team-settings-view__member">
                    <Avatar name={member.name} size="sm" />
                    <span>{member.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    label={`Role for ${member.name}`}
                    hideLabel
                    value={member.role}
                    options={roleOptions}
                    onChange={(event) => handleRoleChange(member, event.target.value as Role)}
                  />
                </TableCell>
                <TableCell>{member.lastActive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
