# Architecture Documentation - Sion Kim
Responsible for Korean Music Page, Music Player Bar.

## hook (useKoreanMusics)
1. What does this hook do?
- Fetch Korean music test data through the service and repository layers.
- Use useState to store data and useEffect to load data when the component mounts.
2. How did you decide what logic to include in that implementation, and how does that correctly separate solution concerns?
- Included logic to store the music data with useState, fetch data with useEffect, and refetch function to reload data after changes.
- Keep the hook focused on data management and the service focused on business logic for the Separation of Concerns principle.
3. Where is this implementation made use of in the project and how?
- Korean Music Page (KoreanMusic.tsx) uses the hook (useKoreanMusics) to fetch the data and display the data in the component.

## service (koreanMusicService)
1. What does this service do?
- Fetch Korean music test data through the repository layer.
- Validate the data to prevent invalid or duplicate entries.
2. How did you decide what logic to include in that implementation, and how does that correctly separate solution concerns?
- Included logic for business rules such as validation, duplication checks, and input length verification.
- Keep the service focused on validation and manipulation of the data and the repository focused on data handling for the Separation of Concerns principle.
3. Where is this implementation made use of in the project and how?
- Service (koreanMusicService) is used by the hook (useKoreanMusics) to fetch, validate, add and delete music to/from the category.

## repository (koreanMusicRepo)
1. What does this repository do?
- Access test data (mockKoreanMusics) and return the data for the service.
2. How did you decide what logic to include in that implementation, and how does that correctly separate solution concerns?
- Included logic to access and modify the test data (mockKoreanMusics).
- Keep the repository focused on data access and manipulation for the Separation of Concerns principle.
3. Where is this implementation made use of in the project and how?
- Repository (koreanMusicRepo) is used by the service (koreanMusicService) to access the test data (mockKoreanMusics) and return the data for the service.

## hook (useYouTubeMusicsList)
1. What does this hook do?
- Fetch YouTube music test data through the service and repository layers.
- Use useState to store data and useEffect to load data when the component mounts.
- Add a song to the playlist with the service layer.
2. How did you decide what logic to include in that implementation, and how does that correctly separate solution concerns?
- Included logic to store the music data with useState, fetch data with useEffect, and add a song to the playlist with the service layer.
- Keep the hook focused on data management and the service focused on business logic for the Separation of Concerns principle.
3. Where is this implementation made use of in the project and how?
- MusicPlayerBar (MusicPlayerBar.tsx) uses the hook (useYouTubeMusicsList) to fetch the data and add a song to the playlist.

## service (youtubeMusicsListService)
1. What does this service do?
- Fetch YouTube music test data through the repository layer.
- Validate the data to prevent invalid or duplicate entries.
- Extract the video ID from the YouTube URL.
- Check if the song is already in the playlist.
- Add the song to the playlist.
2. How did you decide what logic to include in that implementation, and how does that correctly separate solution concerns?
- Included logic for business rules such as validation, extraction, and duplication checks.
- Keep the service focused on addition, validation and manipulation of the video URL and the repository focused on data handling for the Separation of Concerns principle.
3. Where is this implementation made use of in the project and how?
- Service (youtubeMusicsListService) is used by the hook (useYouTubeMusicsList) to fetch, validate, and add a song to the playlist.

## repository (youtubeMusicsListRepo)
1. What does this repository do?
- Access test data (youtubeMusicsList) and return the data for the service.
2. How did you decide what logic to include in that implementation, and how does that correctly separate solution concerns?
- Included logic to access and push the song to the playlistData array.
- Keep the repository focused on data access and manipulation for the Separation of Concerns principle.
3. Where is this implementation made use of in the project and how?
- Repository (youtubeMusicsListRepo) is used by the service (youtubeMusicsListService) to access the test data (youtubeMusicsList) and return the data for the service.

## Why This Architecture?
- This hook/service/repository architecture is used to separate the concerns of the application into three layers. It is easy to add new features or switch to a real database. It is also easy to fix bugs and current code. Moreover, it is reusable to use in other music pages. Therefore, this architecture is suitable for this project.