# Bitflags

Maintain feature flags in a single integer.

## Getting started

```bash
bun add @eckidevs/bitflags
```

## Usage

```typescript
import { defineMask } from '@eckidevs/bitflags';

const featureFlags = defineMask([
  "is_admin",
  "dark_mode",
  "experimental_mode",
  "pro_account",
]);

featureFlags.listActiveFlags(); // []

// Turn a flag on
featureFlags.setFlag("dark_mode"); // true
featureFlags.listActiveFlags(); // ["dark_mode"]

// Get individual flag status
featureFlags.isFlagActive("dark_mode"); // true
featureFlags.isFlagActive("is_admin"); // false

featureFlags.setFlag("pro_account"); // true
featureFlags.listActiveFlags(); // ["dark_mode", "pro_account"]

// List all flags as [string, boolean] tuples
featureFlags.listAllFlags(); // [["is_admin", false], ["dark_mode", true], ["experimental_mode", false], ["pro_account", true]]

// Unset a flag
featureFlags.clearFlag("dark_mode"); // 8 (0b1000)

// Completely remove a flag
featureFlags.removeFlag("pro_account"); // 0 (0b000)

// Add a new flag
featureFlags.addFlag("is_moderator"); // 0 (0b0000)
featureFlags.setFlag("is_moderator"); // true

// Turn all flags on
featureFlags.setState(15); // 15 (0b1111)

// Turn all flags off
featureFlags.setState(0); // 0 (0b0000)
```

## Example use case

Storing a single integer in a SQL column e.g. users

```typescript
import { defineMask } from '@eckidevs/bitflags';

const featureFlags = defineMask([
  "is_admin",
  "dark_mode",
  "experimental_mode",
  "pro_account",
]);

const query = "SELECT flags FROM users WHERE id = $1";
const user = await db.query(query, [1]);

featureFlags.setState(user.flags);

// Check
featureFlags.isFlagActive("dark_mode"); // true

// Update
featureFlags.setFlag("is_admin");
const updateQuery = "UPDATE users SET flags = $1 WHERE id = $2";
await db.query(updateQuery, [featureFlags.getState(), 1]);
```

## Contributing

Feel free to open issues, make PRs, and contribute in any way you think is helpful.
