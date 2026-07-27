import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Card, Input, useToast } from '@mono/ui';

import './LoginView.css';

export function LoginView() {
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({ description: `Signed in as ${username || 'guest'} (mock)`, variant: 'success' });
  };

  return (
    <div className="login-view">
      <Card>
        <form className="login-view__form" onSubmit={handleSubmit}>
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
      </Card>
    </div>
  );
}
