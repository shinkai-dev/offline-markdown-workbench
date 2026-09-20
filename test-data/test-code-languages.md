# コードブロック言語テスト

## Python

```python
def calculate_total(items):
    return sum(item["price"] * item["quantity"] for item in items)

print(calculate_total([
    {"price": 1200, "quantity": 2},
    {"price": 800, "quantity": 3},
]))
```

## JavaScript

```javascript
const users = [
  { name: "Alice", active: true },
  { name: "Bob", active: false }
];
console.log(users.filter(user => user.active));
```

## JSON

```json
{
  "name": "Offline Markdown Workbench",
  "offline": true,
  "features": ["table", "mermaid", "search"]
}
```

## SQL

```sql
SELECT id, name, status
FROM users
WHERE status = 'active'
ORDER BY name ASC;
```

## Bash

```bash
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "Offline Markdown Workbench"
```

## YAML

```yaml
application:
  name: Offline Markdown Workbench
  offline: true
  language: ja
```

## TypeScript

```typescript
interface User {
  id: number;
  name: string;
}

const user: User = { id: 1, name: "田中" };
```


## Pythonの表示確認

```python
class UserService:
    def __init__(self, repository):
        self.repository = repository

    def find(self, user_id):
        # コメントも色分けされます
        user = self.repository.find(user_id)
        return user if user is not None else None
```

## JavaScriptの表示確認

```javascript
async function loadUser(id) {
  const response = await fetchUser(id);
  return response?.name ?? "unknown";
}
```
