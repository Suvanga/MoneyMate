# MoneyMate

# How to Run this locally

## Run Front-End

## Run Back-End

    after cloning
    run cd backend
    1- download all the necessary packages by typing "npm i"
    2- run by typing npm run dev
    3- if it does not tun contact Kritan/Suvanga

# How to Work on a GitHub Repository

## First-Time Setup

### Clone the Repository

1. Open your terminal or command prompt.
2. Clone the repository using the following command:
   ```bash
   git clone https://github.com/.../... (link to the repo)
   ```

### Open in Your IDE

- Open your favorite IDE (Integrated Development Environment).
- Load the cloned repository into your IDE.
- For the rest of commands after this you can use terminal from your IDE.

### Make Sure You Are in the `main` Branch

1. Ensure you are in the `main` branch by running:
   ```bash
   git checkout main
   ```
2. Pull the latest changes:
   ```bash
   git pull origin main
   ```

## Adding New Features or Making Changes

### Create a New Branch from `main`

1. Create a new branch named `feature/(feature-name)`. Example:`feature/new-API-to-get-user-details`:
   ```bash
   git checkout -b feature/(feature-name) origin/main
   ```

### Add Your Code/Changes in That Branch

- Make the necessary changes or add your code to the repository files in your new branch.
- **[IMP]Donot forget to add steps other users have to take to run this project locally in [How to Run this locally](#how-to-run-this-locally) section**

### Commit and Push Your Code

1. Stage all your changes:
   ```bash
   git add .
   ```
2. Commit your changes with an appropriate message:
   ```bash
   git commit -m "Your descriptive commit message"
   ```
3. Push your changes to the new branch:
   ```bash
   git push origin feature/(feature-name)
   ```

### Start a Pull Request

1. Navigate to the original repository on GitHub.
2. Click on the "Pull requests" tab.
3. Click the "New pull request" button.
4. Select your `feature/(feature-name)` branch from the "compare" dropdown.
5. Review your changes and create the pull request by clicking the "Create pull request" button.

### Approving a Pull Request

1. Person who created PR cannot approve his own PR.
2. First verify correct changes are pushed.
3. Verify the the project works by running the pushed branch locally.
4. Finally, verify the functionality added works as expected.

### After Pull Request

**Make sure someone approves your Pull Request first. Do not approve your own pull request.**
Once someone from the team verifies the code works and approves the PR:

1. **Navigate to the Pull Request**
   Go to the pull request page on your Git hosting service (GitHub, GitLab, Bitbucket, etc.).

2. **Review the Pull Request**

   - Review the changes one final time.
   - Make sure that the pull request is up-to-date with the base branch to prevent any merge conflicts. If not, click on the “Update branch” button if available, or manually rebase/merge the branch.

3. **Click on the Merge Button**
   On the pull request page, you will typically see a button to merge the pull request. This button could be labeled as:

   - `Merge pull request` (GitHub)
     Click on this button.

4. **Select the Merge Method**
   Select the merge method as:

   - `Squash and merge`: Combines all commits into a single commit.

5. **Confirm the Merge**

   - You may be prompted to confirm the merge by clicking an additional confirm button.
   - You might also be asked to enter a commit message. By default, the platform provides a pre-filled commit message, which you can edit if necessary.

6. **Merge the Pull Request**
   Once confirmed, the pull request will be merged into the base branch.

### Post-Merge Actions

1. **Delete the Branch**

   After merging, you often have the option to delete the branch that was associated with the pull request. This helps keep the repository clean.

   - In GitHub, you will see a `Delete branch` button.

### Close the issue you are working on

Mark the issue as Closed complete after you are done working

Congratulations! You have now successfully submitted a pull request to merge your changes into the `main` branch.

## Continuing to Work on the Repository

### Fetch Changes from Upstream

1. Ensure you are in the `main` branch:
   ```bash
   git checkout main
   ```
2. Pull the latest changes:
   ```bash
   git pull origin main
   ```

### Create a New Branch

- Follow the steps mentioned in the section [Create a New Branch from `main`](#create-a-new-branch-from-main) to start new work.

### Make Changes, Commit, and Push

- Follow the steps mentioned in the section [Add Your Code/Changes in That Branch](#add-your-codechanges-in-that-branch) to make changes.
- Follow the steps mentioned in the section [Commit and Push Your Code](#commit-and-push-your-code) to commit and push your code.

### Start a New Pull Request

- Follow the steps mentioned in the section [Start a Pull Request](#start-a-pull-request) to start a new pull request.

By following these steps, you can continue to contribute to the repository effectively.
