---
title: "The process of crafting a great tutorial"
date: "2024-11-14"
tags:
- design
- work
- process
---

Effective knowledge sharing requires the right tools and a thoughtful process. Here’s how I approach creating tutorials, from drafting scripts to sharing polished videos.



In this guide, I’ll walk you through my approach to creating tutorials using a specific example: How to Redeem Vouchers, designed for Groupon Merchants.



## The tools

- Claude and ChatGPT – for refining and perfecting the script.

- Tella – for recording desktop content and editing the source materials.

- Bezel – for capturing mobile device screens.

- FFmpeg – for sound editing, including removing and merging audio tracks.

- Eleven Labs – for enhancing or changing voiceovers.



## The process

1. Script

1. Preparation

1. Record, edit and download

1. Post processing

1. Share



### Script

First, it is crucial to draft the script with the screenshots. For signing it off with stakeholders, the draft lives in a Google doc. Then have it proofread using an AI tool of your choice – I used a combination of <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer">Claude</a> and <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">ChatGPT</a>. 

### Preparation

Before recording, ensure all necessary accounts and materials are ready, with no sensitive data visible.

For example, I prepared a Merchant Center account with a corresponding Customer account containing at least six available vouchers for redemption. Testing this setup in advance ensures a smooth recording process.

### Record, edit and download

Capture footage using <a href="https://www.tella.tv/" target="_blank" rel="noopener noreferrer">Tella</a> for desktop recordings and Bezel for mirroring and recording mobile device screens.

- Tella offers a flexible editing environment where you can trim, rearrange, or replace sections with ease.

- For mobile recordings, Bezel mirrors the device screen onto your computer, ensuring high-quality visuals.

![Multiple recordings in Tella edit mode](/images/Screenshot_2024-11-18_at_21.58.44.png.webp)

## Post processing

Extract the original audio using FFmpeg:



```bash
ffmpeg -i original_video.mp4 -q:a 0 -map a output_audio.mp3
```

Use <a href="https://elevenlabs.io/" target="_blank" rel="noopener noreferrer">Eleven Labs</a> to replace the audio with a professional-quality voiceover. For instance, I prefer the River voice option. 

![Eleven Labs voice changer](/images/Screenshot_2024-11-14_at_10.22.04.png.webp)

Upload the extracted audio, generate the new version, and save it as main_audio.mp3.

Remove the original audio from the video:

```bash
ffmpeg -i original_video.mp4 -an video_without_audio.mp4
```

Combine the video with the new voiceover and background music (set the music volume to 2% for balance):

```bash
ffmpeg -i video_without_audio.mp4 -i main_audio.mp3 -i background_music.mp3 -filter_complex "[1:a]volume=1[a1];[2:a]volume=0.02[a2];[a1][a2]amix=inputs=2:duration=first[a]" -map 0:v -map "[a]" -c:v copy -shortest output_video_with_audio_and_bg_music.mp4
```

### Share

Upload your polished tutorial to YouTube or your preferred platform and share it with your audience!



## Guidelines for tutorial design

To ensure a professional and visually appealing result:

- Use a gradient background for a polished aesthetic.

- Keep the layout minimal and uncluttered.

- Use zoom effects to emphasize important details.

- Add pleasant, non-intrusive background music to enhance the viewing experience.



Creating tutorials can be a rewarding process, allowing you to share knowledge in an engaging and professional way. Happy creating! 


