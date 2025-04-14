// Sample video interface
export interface SampleVideo {
  title: string;
  description: string;
  video_url: string;
}

// Sample educational videos users can add
export const sampleVideos: SampleVideo[] = [
  {
    title: "Introduction to Neural Networks",
    description:
      "Learn the fundamentals of neural networks and how they form the basis of modern AI systems.",
    video_url: "https://www.youtube.com/watch?v=aircAruvnKk",
  },
  {
    title: "The Physics of Black Holes",
    description:
      "Explore the fascinating physics behind black holes and their impact on our understanding of the universe.",
    video_url: "https://www.youtube.com/watch?v=e-P5IFTqB98",
  },
  {
    title: "Understanding Blockchain Technology",
    description:
      "A beginner-friendly explanation of blockchain technology and its applications beyond cryptocurrency.",
    video_url: "https://www.youtube.com/watch?v=SSo_EIwHSd4",
  },
  {
    title: "The Science of Climate Change",
    description:
      "An evidence-based overview of climate science and how human activities are affecting our planet.",
    video_url: "https://www.youtube.com/watch?v=ifrHogDujXw",
  },
];
