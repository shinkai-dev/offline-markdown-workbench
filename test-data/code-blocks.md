# Code Block Regression Tests

Use this file in the Markdown preview to verify fenced-code rendering, language labels, highlighting, and nested `<details>` handling.

## 1. Backtick fences with language identifiers

<details>
  <summary>Parent section</summary>

  ### TypeScript

  ```ts
  // TypeScript line comment should use the comment color
  import type { User } from "./user"; // import comment
  interface UserRecord { id: number; }
  ```

  ### C#

  ```csharp
  // C# line comment should use the comment color
  using System; // namespace import comment
  public sealed class Example { /* block comment */ }
  ```

  ### SQL

  ```sql
  -- SQL line comment should use the comment color
  SELECT id FROM users; -- trailing SQL comment
  ```

  ### C++

  ```cpp
  // C++ line comment should use the comment color
  #include <string> // header comment
  /* block comment */ int main() { return 0; }
  ```

  Parent paragraph after the child accordion.
</details>

### TypeScript

```ts
interface User {
  id: number;
  name: string;
}

// const
const greet = (user: User): string => `Hello, ${user.name}`;
console.log(greet({ id: 1, name: "Ada" }));
```

     ```ts
     interface User {
       id: number;
       name: string;
     }

     const greet = (user: User): string => `Hello, ${user.name}`;
     console.log(greet({ id: 1, name: "Ada" }));
     ```

### JavaScript

```js
// Transform a list with an arrow function.
import { strict as assert } from "node:assert";

const items: number[] = [1, 2, 3];
const doubled = items.map((item) => item * 2);
assert.deepEqual(doubled, [2, 4, 6]);
```

   - インデント
    ```js
    // Transform a list with an arrow function.
    import { strict as assert } from "node:assert";

    const items: number[] = [1, 2, 3];
    const doubled = items.map((item) => item * 2);
    assert.deepEqual(doubled, [2, 4, 6]);
    ```

### Java

```java
import java.util.List; // collection API
import java.util.logging.Logger;

/** Demonstrates a public class and static entry point. */
public final class Main {
    private static final Logger LOG = Logger.getLogger(Main.class.getName());

    public static void main(String[] args) {
        List<String> names = List.of("Ada", "Grace");
        names.forEach(LOG::info);
    }
}
```

### C#

```csharp
using System;
using System.Collections.Generic;

// A sealed class with a private field and public method.
public sealed class Program
{
    private static readonly string Greeting = "Hello";

    public static void Main()
    {
        List<string> names = new() { "Ada", "Grace" };
        foreach (string name in names)
        {
            Console.WriteLine($"{Greeting}, {name}");
        }
    }
}
```

### C

```c
#include <stdio.h> /* standard I/O */

// Entry point; const qualifies the input pointer target.
static const char *greeting = "Hello, world!";
int main(void) {
    printf("%s\n", greeting);
    return 0;
}
```

### C++

```cpp
#include <iostream>
#include <vector>

// A small example of templates, const, and range-based for.
class Greeter final {
public:
    static void say(const std::vector<int>& values) {
        for (const auto value : values) std::cout << value << '\n';
    }
};

int main() {
    Greeter::say({1, 2, 3});
}
```

### Python

```python
from dataclasses import dataclass

# Type annotations and decorators should remain readable.
@dataclass(frozen=True)
class User:
    name: str

def greet(user: User) -> str:
    return f"Hello, {user.name}"  # inline comment

print(greet(User("Ada")))
```

### Go

```go
package main

import (
    "fmt" // standard output
    "strings"
)

type User struct { Name string }

func main() {
    user := User{Name: "Ada"}
    fmt.Println(strings.ToUpper(user.Name))
}
```

### Rust

```rust
use std::fmt; // standard formatting traits

struct User { name: String }

impl User {
    pub fn greeting(&self) -> String {
        format!("Hello, {}", self.name)
    }
}

fn main() {
    let user = User { name: String::from("Ada") };
    println!("{}", user.greeting());
}
```

### PHP

```php
<?php
// Import a standard library class and declare a typed property.
use DateTimeImmutable;

final class Greeter {
    public function greet(string $name): string {
        return "Hello, {$name}";
    }
}

echo (new Greeter())->greet("Ada");
```

### Ruby

```ruby
names = ["Ada", "Grace"]
names.each { |name| puts "Hello, #{name}" }
```

### Kotlin

```kotlin
import java.time.LocalDate

// Kotlin class modifiers and immutable values.
data class User(val name: String)

fun main() {
    val names = listOf(User("Ada"), User("Grace"))
    names.forEach { user -> println("${user.name}: ${LocalDate.now()}") }
}
```

### Swift

```swift
import Foundation

// A struct with an immutable property.
struct User {
    let name: String
}

for user in [User(name: "Ada"), User(name: "Grace")] {
    print("Hello, \(user.name)")
}
```

### SQL

```sql
-- Read active users in a stable order.
SELECT id, name
FROM users
WHERE active = TRUE
  AND role IN ('admin', 'editor')
ORDER BY name;
```

### Bash

```bash
#!/usr/bin/env bash
for name in Ada Grace; do
  echo "Hello, ${name}"
done
```

### PowerShell

```powershell
$names = @("Ada", "Grace")
foreach ($name in $names) {
  Write-Output "Hello, $name"
}
```

### HTML (tags must remain code)

```html
<div class="example">
  <p>Hello</p><br />
</div>
```

### CSS

```css
.card {
  display: flex;
  gap: 1rem;
  color: #123456;
}
```

### JSON

```json
{
  "name": "Ada",
  "active": true,
  "roles": ["author", "reviewer"]
}
```

### YAML

```yaml
name: Ada
active: true
roles:
  - author
  - reviewer
```

## 2. Indented fenced code inside a list (regression case)

- Indented code block
     ```ts
     // The fence has five leading spaces and must still be recognized.
     interface User {
       id: number;
       name: string;
     }

     const greet = (user: User): string => `Hello, ${user.name}`;
     console.log(greet({ id: 1, name: "Ada" }));
     ```

## 3. Tilde fence

~~~python
numbers = [1, 2, 3]
print(sum(numbers))
~~~

## 4. Fence without a language identifier

```
Plain text should still be rendered in a code block.
HTML-looking text must remain literal: <div><br></div>
**Markdown-looking text must not become bold.**
```

## 5. Nested details with code blocks

<details>
  <summary>Parent section</summary>

  Parent paragraph before the child accordion.

  <details>
    <summary>Child section — TypeScript</summary>

    ```ts
    type Status = "ready" | "busy";
    const status: Status = "ready";
    console.log(status);
    ```

    Child paragraph after the code block.

    <details>
      <summary>Grandchild section — Java</summary>

      ~~~java
      public class NestedExample {
          public static void main(String[] args) {
              System.out.println("Nested code block");
          }
      }
      ~~~

      - List item one
      - List item two
    </details>
  </details>

  Parent paragraph after the child accordion.
</details>

## 6. HTML tags inside code must remain literal

```html
<details>
  <summary>Not an actual accordion</summary>
  <div><p>These tags are code examples.</p></div>
</details>
```



