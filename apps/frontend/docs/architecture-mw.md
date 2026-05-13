# Architecture Documentation - Meng Wang

hooks, services, and repositories for the Chinese-music feature, Add Form,and Search functionality. 

---

## Chinese Music feature (repo + hook + service)

Files involved
- Hook(s): `useChineseMusics.ts`
- Service: `chineseMusicService.ts`
- Repository: `chineseMusicRepo.ts`

1. What does this do?

- Repository
  - Access data through this repo to Chinese music data. 
  - Exposes 3 functions to read the dataset and perform basic  CRUD (get, add, delete).
- Service
  - Implements business and validation rules (duplicate checks, minimum-length checks for new entries).
  - It will call the repo file for operation with errors/messages.
- Hook(s)
  - This is a presentation layer. Handles UI state and use useState to store data.
  - `useChineseMusics.ts` loads and fetch data through service layer.

2. How did you decide what logic to include in that implementation, and how does that correctly separate solution concerns?

- Repository (`chineseMusicRepo`) fetch the data source and basic data CRUD operation. It exposes basic get, add, delete function that can operate on dataset of `mockChineseMusics.ts`.
- Service (`chineseMusicService`) implements business rules and validation handlings. The service calls the repo functions to perform data changes only after validation.
- Hooks (`useChineseMusics`) are presentation layers for React components. `useChineseMusics` loads data and useState to store data in chinese page.

This separation keeps: data access (repo) separated from business logic (service) and presentation logic (hooks). That makes code maintainable and keeps the component focused on rendering and user interaction.

3. Where it's used

- The page at `src/components/pages/musicpages/ChineseMusic.tsx` call hook `useChineseMusics` to render categories and `useChineseMusicForm` to use add/delete form actions. 

---

## Add Form (hook + service)

Files involved
- Hook: `/useAddForm.tsx`
- Service: `addFormService.ts`

1. What does this do?

- Hook
  - `useAddForm` keeps local form state (field1, field2) and provides handlers for change, submit, cancel, and clear.
- Service
  - `addFormService` validates fields, processes the input, and calls the onSubmit with cleaned data.

2. How did you decide what logic to include, and how does that separate concerns?

- Hook manages UI state and calls the service for validation/submit. This keeps component code simple and focused on rendering.
- Service holds validation and data-processing logic so it can be reused without UI code.

3. Where it's used

- The component is used by Chinese music page to collect input. It will call the `useAddForm` hook to use the preseantion logic, and hook will call addformservice to use business logic and validation.

---

## Search (hook + service)

Files involved

- Hook: `src/hooks/useSearch.tsx`
- Service: `src/services/searchService.ts`

1. What does this do?

- Service
  - `searchService` looks through all music data and finds matches data. It also returns the full category list for empty searches.
- Hook
  - `useSearch` manages the search input, loading state, and provide UI presentation.

2. How did you decide what logic to include, and how does that separate concerns?

- Hook handles presentation, loading flags. Keeping code staightforward and easy to use.
- Service does the pure search and sorting logic. It has no UI knowledge.

3. Where it's used

- `SearchModal` uses hook `useSearch` to show the search box and results. The modal renders results returned by the hook and uses the service via the hook.

