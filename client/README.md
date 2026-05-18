## User Roles & Access Control

The system implements strict Role-Based Access Control (RBAC) separating administrative operators from standard voters.

### Automatic Admin Elevation

- **First-Registration Rule:** The system automatically grants the `Admin` role to the **very first user account** created in a blank database.
- **Subsequent Users:** All registrations following the initial account are explicitly assigned the `User` role by default.
- **Database Reset Option:** To provision a custom administrative account from scratch, truncate or delete all rows within the cloud/local database `users` table and register your chosen credentials first.

### Default Testing Credentials

- **Administrator Email:** `admin@gmail.com`
- **Testing Password (All Accounts):** `123456`

---

## Core Application Workflows

### Administrative Privileges (`Admin`)

The system administrator manages election initialization, system health oversight, and active metrics compilation.

- **Full Poll Lifecycle Control (CRUD):** Complete authority to create, read, update, and delete poll configurations.
- **Manual Lifecycle Interrupt:** Administrators can manually step in and terminate/close any active poll ahead of its automated expiration timestamp.
- **Stale-State Protection:** To preserve election integrity, administrators are strictly prohibited from editing or changing properties on an active contest once **at least one (1) vote** has been cast.
- **Voter Isolation:** Administrative profiles are barred from casting votes on any active contest and are completely excluded from eligible voter tallies during systemic dataset collation.

### Voter Capabilities (`User`)

Standard authentication grants access to securely explore active ballots, cast transparent votes, and inspect personal statistics.

- **Active Contests:** Users can safely cast exactly one vote per active poll.
- **Interaction Tracking:** The platform appends a distinct state badge (`YOU VOTED`) to all poll cards that a user has already interacted with.

- **Result Visibility:**
  - **Closed Polls:** Voting capabilities are locked down completely, but full results are visible to authenticated users.
  - **Active Polls:** Users must cast their vote _before_ the application unlocks access to view current running result statistics.
  - **Global Gate Keep:** If a user has a clean voting record with zero (0) cast votes across the platform, they are dynamically restricted from inspecting _any_ poll results across the system.
- **Historical Auditing:** A dedicated Voting History timeline permits users to review past ballots they have personal data footprint on.
- **Identity Card:** Clicking the account profile icon exposes user-specific registration metadata including their Name, Email Address, and selected Nigerian Registration State.
