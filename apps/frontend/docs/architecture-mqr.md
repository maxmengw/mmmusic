# Architecture Documentation - Marion Queen Ramos
Responsible for Filipino Music Page, Delete Form Component.

## Hook: useFilipinoMusic

### What does it do?
Fetches Filipino music data and manages it in state. Returns the data and a refetch function to reload it.

### How did you decide what logic to include?
I put React-specific items here:
- useState for storing the music data
- useEffect to fetch data when component loads
- refetch function to reload data after changes

The hook calls the service to get data, but doesn't validate anything or touch the data directly. That keeps it focused on just React state management.

### Where is it used?
Used in `FilipinoMusic.tsx` component. It gives the component the music data to display and lets it refresh the data after adding or deleting examples.


## Hook: useFilipinoMusicForm

### What does it do?
Manages the Add and Delete modals (open/close state) and handles form submissions for adding and deleting music.

### How did you decide what logic to include?
I put UI interaction logic here:
- Modal open/close state with useState
- handleAddMusic: calls service to add, then refetches data
- handleDeleteMusic: calls service to delete, then refetches data
- Error handling with alert messages

The hook manages the modal states and calls the service for validation/data changes. It doesn't validate inputs itself - just passes them to the service and handles the results.

### Where is it used?
Used in `FilipinoMusic.tsx` to control the Add/Delete modals. Provides functions to the AddForm and DeleteForm components for when users submit.


## Service: filipinoMusicService

### What does it do?
Validates inputs and enforces business rules before allowing data changes. Acts as a gatekeeper between hooks and the repository.

### How did you decide what logic to include?
I put all validation and business rules here:
- Check if music example already exists (no duplicates)
- Check input length (minimum 3 characters)
- Make sure category exists before adding/deleting
- Throw errors if validation fails

The service has all the "business logic" like "don't allow duplicates" or "names must be at least 3 characters." This way, the hook doesn't need to know these rules, and the repository doesn't validate - it just does what it's told.

### Where is it used?
Called by `useFilipinoMusicForm` whenever a user tries to add or delete music. The service validates first, then calls the repository if everything is okay.



## Repository: filipinoMusicRepo

### What does it do?
Handles reading and writing data. Currently works with mock data in an array, but designed to easily swap to a database later.

### How did you decide what logic to include?
I put only data access here:
- getFilipinoMusics: returns the data
- addFilipinoMusicToCategory: adds an example to the array
- deleteFilipinoMusicFromCategory: removes examples from the array

No validation, no business rules, just pure data operations. This makes it easy to replace the mock data with database calls later without changing the service or hooks.

### Where is it used?
Called only by `filipinoMusicService`. The service validates everything first, then tells the repository to do the actual data change.


## Component: DeleteForm

### What does it do?
Reusable form component that lets users select a category, see all examples in it, check which ones to delete, and submit.

### How did you decide what logic to include?
I kept it focused on UI state:
- Selected category (which category is picked in dropdown)
- Checked examples (which checkboxes are selected)
- Filtering examples based on selected category

The component handles displaying the form and tracking selections. It doesn't validate or delete anything - just collects the user's choices and passes them to the parent component via onSubmit.

### Where is it used?
Used in:
- `FilipinoMusic.tsx` for deleting Filipino examples
- `KoreanMusic.tsx` for deleting Korean examples
- `ChineseMusic.tsx` for deleting Chinese examples

Same component works for all three by using different className props for styling and different category data.


## How Everything Works Together

**Deleting Music Flow:**
1. User clicks Delete button → modal opens
2. User selects category and checks examples
3. User submits
4. `useFilipinoMusicForm.handleDeleteMusic()` called
5. Hook calls `filipinoMusicService.deleteFilipinoMusicFromCategory()`
6. Service validates (category exists, examples exist)
7. Service calls `filipinoMusicRepo.deleteFilipinoMusicFromCategory()`
8. Repository removes from mock data array
9. Hook calls `refetch()` to reload data
10. UI updates without deleted examples


## Why This Architecture?

- **Easy to test**: Each layer can be tested separately
- **Easy to change**: Swap mock data for database without touching hooks
- **Clear responsibilities**: Each file has one job
- **Reusable**: Service and repo can be used by other components
- **Maintainable**: New developers can understand the flow easily
