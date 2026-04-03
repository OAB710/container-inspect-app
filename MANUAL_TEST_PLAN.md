# Manual Test Plan - Container Inspect App

## 1. Objective
Validate the primary workflows of the entire application (Frontend + Backend), specifically focusing on:
* Authentication (Registration / Login / Logout).
* Inspection listing and filtering.
* Creating / Editing / Saving Drafts / Completing inspections.
* Damage and photo management.
* State-based access control (Draft vs. Completed).
* API stability, image uploading, and data synchronization.

## 2. Prerequisites
* Backend is running and successfully connected to the PostgreSQL database.
* Frontend is installed and running on an Android/iOS emulator or a physical device.
* At least two test accounts exist: `admin` and `surveyor`.
* Database contains at least 1 pending container (uninspected) and 1 `completed` container.
* Cloudinary (or equivalent file upload service) is correctly configured.
* Active internet connection (if testing against a production/staging API).

## 3. Quick Smoke Test
* [✓] App launches successfully without crashing.
* [✓] Login/Register screen renders correctly on startup.
* [✓] User can log in successfully with valid credentials.
* [✓] App navigates to the Inspection List upon successful login.
* [✓] User can log out successfully.
* [✓] Relaunching the app after logout keeps the user on the login screen.

## 4. Authentication & Authorization
### 4.1 Registration (Sign Up)
* [✓] **Valid Registration:** Sign up successfully with a valid, unique username/email and password.
* [✓] **Duplicate Account:** Show a clear error message when attempting to register with an already existing username/email.
* [✓] **Password Validation:** Show an error if the password does not meet minimum length or complexity requirements.
* [✓] **Empty Fields:** Prevent submission and show validation errors if required fields are left blank.
* [✓] **Post-Registration Flow:** Verify that after successful registration, the user is either auto-logged in or correctly redirected to the Login screen (based on app flow).

### 4.2 Login
* [✓] **Valid Login:** Log in successfully with a valid username/email and password.
* [✓] **Invalid Password:** Show a clear error message when entering an incorrect password.
* [✓] **Empty Fields:** Prevent submission and show validation errors if username/password fields are left blank.
* [✓] **Auto-Login:** Close and reopen the app; verify the user remains logged in without needing to re-enter credentials.

### 4.3 Logout
* [✓] Verify tapping "Logout" clears the session/token and redirects to the Login screen.
* [✓] Verify the user cannot navigate back to the app's internal screens using device back buttons after logging out.

### 4.4 Authorization & Role-Based Access
* [✓] **Admin:** Verify Admin accounts can view and access data according to admin privileges.
* [✓] **Surveyor:** Verify Surveyors can only view their assigned/own inspections (if backend filtering is applied).
* 
## 5. Inspection List
* [✓] List loads and displays the correct data.
* [✓] Status badges (`Draft` / `Completed`) are displayed accurately.
* [✓] Pull-to-refresh correctly fetches and updates the list.
* [✓] Empty state UI displays correctly when there is no data.
* [✓] Tapping an item navigates to the Inspection Details screen.
* [✓] Floating Action Button (FAB) for creating a new inspection is visible and opens the creation screen.

## 6. Create New Inspection
* [✓] Open the creation screen via the FAB.
* [✓] Container dropdown successfully loads the list of available containers.
* [✓] Verify locked/already inspected containers cannot be selected (based on business logic).
* [✓] Surveyor field auto-fills correctly based on the logged-in user's role.
* [✓] Inspection ID (Mã giám định) is automatically generated for new records.
* [✓] Result and Note fields accept and save input properly.

## 7. Save Draft Inspection
* [✓] Save a new inspection with basic data.
* [✓] Edit an existing `Draft` inspection and tap "Save".
* [✓] The status remains `Draft` after saving.

## 8. Damages Management
* [✓] Add a new damage record.
* [✓] Add multiple damage records.
* [✓] Edit an existing damage record.
* [✓] Delete a damage record.
* [✓] **Draft State:** Ensure adding/editing/deleting damages is allowed.
* [✓] **Completed State:** Ensure adding/editing/deleting damages is completely disabled.

### 8.1 Damage Photos
* [✓] Take a photo using the device camera.
* [✓] Select a photo from the device gallery.
* [✓] Reorder photos
* [✓] Verify local photos are successfully uploaded to Cloudinary when tapping "Save Inspection".
* [✓] Uploaded photos render correctly in the details screen.

## 9. Complete Inspection
* [✓] Modify inspection details or damages, then tap "Complete Inspection".
* [✓] Verify all newly modified data is recorded before the status shifts.
* [✓] Status badge changes to `Completed`.
* [✓] **UI Lockdown:** After completion, the user cannot edit inspection info.
* [✓] **UI Lockdown:** After completion, the user cannot add/edit/delete damages.
* [✓] **UI Lockdown:** After completion, the user cannot add/delete photos.
* [✓] Save and Complete buttons are hidden or disabled when the status is `Completed`.