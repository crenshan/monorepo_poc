export interface UsageExample {
  title: string;
  tags: string[];
  components: string[];
  code: string;
  notes?: string;
}

export const examples: UsageExample[] = [
  {
    title: 'Sign-in form with a toast on success',
    tags: ['form', 'auth', 'login', 'submit', 'toast'],
    components: ['Card', 'Input', 'Button', 'useToast'],
    notes:
      'The form itself has no validation errors to show, so the Inputs skip the error prop entirely — pass it only when there is a message to display.',
    code: `<Card>
  <form onSubmit={handleSubmit}>
    <h2>Sign in</h2>
    <Input
      label="Username"
      name="username"
      autoComplete="username"
      value={username}
      onChange={(event) => setUsername(event.target.value)}
    />
    <Input
      label="Password"
      name="password"
      type="password"
      autoComplete="current-password"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
    />
    <Button type="submit">Sign in</Button>
  </form>
</Card>`,
  },
  {
    title: 'Searchable member list with inline role editing',
    tags: ['table', 'search', 'filter', 'inline-edit', 'select', 'avatar'],
    components: [
      'Input',
      'Table',
      'TableHead',
      'TableBody',
      'TableRow',
      'TableHeaderCell',
      'TableCell',
      'Avatar',
      'Select',
    ],
    notes:
      'The per-row Select reuses the label prop for its accessible name but sets hideLabel so it reads visually as a plain dropdown inside the cell — every Select still needs a real label, just not always a visible one.',
    code: `<>
  <Input
    label="Search members"
    placeholder="Search by name"
    value={query}
    onChange={(event) => setQuery(event.target.value)}
  />
  <Table aria-label="Team members">
    <TableHead>
      <TableRow>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell>Role</TableHeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {members.map((member) => (
        <TableRow key={member.id}>
          <TableCell>
            <Avatar name={member.name} size="sm" decorative />
            <span>{member.name}</span>
          </TableCell>
          <TableCell>
            <Select
              label={\`Role for \${member.name}\`}
              hideLabel
              value={member.role}
              options={roleOptions}
              onChange={(event) => handleRoleChange(member, event.target.value)}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</>`,
  },
  {
    title: 'Empty state after filtering',
    tags: ['empty', 'empty state', 'no results', 'placeholder', 'card'],
    components: ['Card'],
    notes:
      'A plain Card with a short message is the standard empty-state pattern across this codebase — used identically for "no search results" and "nothing here yet" cases, just with different copy.',
    code: `{filteredMembers.length === 0 ? (
  <Card>
    <p>{members.length === 0 ? 'No team members yet.' : \`No members match "\${query}".\`}</p>
  </Card>
) : (
  <MemberTable members={filteredMembers} />
)}`,
  },
  {
    title: 'Date-range filtered report table',
    tags: ['date range', 'filter', 'table', 'validation', 'error', 'reports'],
    components: [
      'DateRangePicker',
      'Card',
      'Table',
      'TableHead',
      'TableBody',
      'TableRow',
      'TableHeaderCell',
      'TableCell',
    ],
    notes:
      'error is derived from value rather than tracked as separate state — DateRangePicker is fully controlled, so validation can just be a function of the current start/end.',
    code: `<>
  <DateRangePicker label="Date range" value={range} onChange={setRange} max={today} error={error} />

  <Card>
    <p>
      Showing data from <strong>{range.start || '—'}</strong> to <strong>{range.end || '—'}</strong>.
    </p>
  </Card>

  <Table aria-label="Reports">
    <TableHead>
      <TableRow>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell>Category</TableHeaderCell>
        <TableHeaderCell>Date</TableHeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredReports.map((report) => (
        <TableRow key={report.id}>
          <TableCell>{report.name}</TableCell>
          <TableCell>{report.category}</TableCell>
          <TableCell>{report.date}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</>`,
  },
  {
    title: 'Confirmation modal before a destructive action',
    tags: ['modal', 'dialog', 'confirm', 'destructive', 'delete'],
    components: ['Modal', 'Button'],
    notes:
      'onClose fires from Escape, a backdrop click, and the header close button alike — funnel all three through one handler rather than trying to distinguish them.',
    code: `<>
  <Button onClick={() => setOpen(true)}>Delete report</Button>
  <Modal open={open} onClose={() => setOpen(false)} title="Delete report">
    <p>
      Are you sure you want to delete &ldquo;{report.name}&rdquo;? This action can&rsquo;t be undone.
    </p>
    <Button onClick={() => onConfirm(report.id)}>Delete</Button>
    <Button onClick={() => setOpen(false)}>Cancel</Button>
  </Modal>
</>`,
  },
  {
    title: 'Dismissible error banner after a failed save',
    tags: ['alert', 'error', 'banner', 'dismiss', 'feedback'],
    components: ['Alert'],
    notes:
      'onDismiss is what makes the dismiss (×) button render at all — an Alert without it (like a static page-level notice) has no way for the user to close it, which is often what you want.',
    code: `<Alert variant="danger" title="Couldn't save changes" onDismiss={onDismiss}>
  {message}
</Alert>`,
  },
  {
    title: 'App-root ToastProvider with a success/error trigger',
    tags: ['toast', 'notification', 'feedback', 'provider', 'setup'],
    components: ['ToastProvider', 'useToast', 'Button'],
    notes:
      'ToastProvider wraps the app exactly once, near the root (in main.tsx, outside <App />) — components anywhere in the tree then call useToast() to queue a toast without any further setup.',
    code: `{/* main.tsx, wrapping the whole app once */}
<ToastProvider>
  <App />
</ToastProvider>

{/* anywhere inside the tree, via const { toast } = useToast() */}
<Button onClick={() => toast({ description: 'Changes saved', variant: 'success' })}>
  Save
</Button>`,
  },
  {
    title: 'Loading panel that swaps a Spinner for content',
    tags: ['loading', 'async', 'spinner', 'fetch', 'card'],
    components: ['Spinner', 'Card'],
    notes:
      'Spinner already announces its label via role="status", so there is no need for a separate visually-hidden loading message alongside it.',
    code: `<Card>
  {usage === null ? <Spinner label="Loading usage" /> : <p>{usage.requests} requests this month</p>}
</Card>`,
  },
  {
    title: 'Icon-only accessible action button',
    tags: ['icon', 'icon-button', 'accessibility', 'aria'],
    components: ['Icon', 'Button'],
    notes:
      "An icon rendered on its own (no visible text label) needs Icon's title prop so it gets an accessible name — without it, the icon is aria-hidden and the button would be silent to screen readers.",
    code: `<Button onClick={onDismiss}>
  <Icon name="x" size="sm" title="Remove item" />
</Button>`,
  },
  {
    title: 'Status badges in a data table',
    tags: ['badge', 'status', 'table', 'data display'],
    components: [
      'Badge',
      'Table',
      'TableHead',
      'TableBody',
      'TableRow',
      'TableHeaderCell',
      'TableCell',
    ],
    notes:
      "Maps a domain status to a Badge variant (e.g. { pending: 'neutral', approved: 'success', rejected: 'danger' }) rather than hardcoding a variant per row, so the color mapping lives in one place.",
    code: `<Table aria-label="Access requests">
  <TableHead>
    <TableRow>
      <TableHeaderCell>Requester</TableHeaderCell>
      <TableHeaderCell>Status</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {requests.map((request) => (
      <TableRow key={request.id}>
        <TableCell>{request.requester}</TableCell>
        <TableCell>
          <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
  },
];
