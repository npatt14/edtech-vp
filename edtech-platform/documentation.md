## Overview

An overview of the key components and files in the platform. 


### Context

- **VideoContext.tsx**  
  Central data provider for all video operations. Handles API calls, state management, and provides a consistent interface for componets to access video data..

### Hooks

- **useVideoState.ts**  
  Powers the video player functionality. Handles both HTML5 and YouTube videos.

### Components

- **VideoPlayer.tsx**  
  The custom video player componnt. Supports both YouTube and standard video files.

- **VideoForm.tsx**  
  Handles the creation and editing of videos.

- **VideoCard.tsx**  
  Displays video information in a card format with thumbnail.

### Pages

- **page.tsx (Home)**  
  Landing page with introduction and animated math symbols.

- **videos/page.tsx**  
  Main video library view with search, filtering, and video grid.

- **videos/[id]/page.tsx**  
  Individual video view with comments.
