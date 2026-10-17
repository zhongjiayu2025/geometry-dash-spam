// Observed directly in the maintained SCL v2.0.0 UI on this date.
// Ranks and eligibility fields belong to this list, not Pointercrate.
export const SCL_CHECKED_AT = "2026-10-16";
export const SCL_SOURCE = "https://thespamchallengelist.pages.dev/#/";
export const SPAM_CHALLENGES = [
  { rank: 2, name: "Mesmerized", id: 125682406, publisher: "ILoveLilies", fps: "CBF", method: "Alternating", device: "All", handcam: "Necessary", video: "https://www.youtube.com/watch?v=y5NZwSYdvnM", note: "A high-ranked reference for checking submission evidence. Its entry makes handcam necessary, which is stronger than the general top-50 recommendation." },
  { rank: 4, name: "Needles chal", id: 69806204, publisher: "MeowPau", fps: "CBF", method: "Alternating", device: "Uncapped", handcam: "Recommended", video: "https://www.youtube.com/watch?v=ucmMsM55xd8", note: "Useful for understanding device eligibility: the method matches Mesmerized, but this entry adds an Uncapped device condition. A similar CPS score does not establish that condition." },
  { rank: 43, name: "Spam Me Maybe", id: 125122406, publisher: "zLiknod", fps: "60", method: "Alternating", device: "All", handcam: "Recommended", video: "https://www.youtube.com/watch?v=UW1AVtWMEXw", note: "A comparison case for a fixed 60-FPS requirement. A CBF completion of a different entry cannot be used to infer this entry’s eligibility or difficulty." },
] as const;
