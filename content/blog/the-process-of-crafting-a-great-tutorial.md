---
title: "The process of crafting a great tutorial"
date: "2024-11-14"
tags:
- design
- work
- process
---

Effective knowledge sharing requires the right tools and a thoughtful process. Here’s how I approach creating tutorials, from drafting scripts to sharing polished videos.



In this guide, I’ll walk you through my approach to creating tutorials using a specific example: **How to Redeem Vouchers**, designed for Groupon Merchants.



## **The tools**

- [**Claude**](https://claude.ai/)** and **[**ChatGPT**](https://chatgpt.com/) – for refining and perfecting the script.

- [**Tella**](https://www.tella.tv/) – for recording desktop content and editing the source materials.

- [**Bezel**](https://nonstrict.eu/bezel/) – for capturing mobile device screens.

- [**FFmpeg**](https://www.ffmpeg.org/) – for sound editing, including removing and merging audio tracks.

- [**Eleven Labs**](https://elevenlabs.io/) – for enhancing or changing voiceovers.



## **The process**

1. **Script**

1. **Preparation**

1. **Record, edit and download**

1. **Post processing**

1. **Share**



### Script

First, it is crucial to draft the script with the screenshots. For signing it off with stakeholders, the draft lives in a Google doc. Then have it proofread using an AI tool of your choice – I used a combination of [Claude](https://claude.ai/new) and [ChatGPT](https://chatgpt.com/). 

### Preparation

Before recording, ensure all necessary accounts and materials are ready, with no sensitive data visible.

For example, I prepared a Merchant Center account with a corresponding Customer account containing at least six available vouchers for redemption. Testing this setup in advance ensures a smooth recording process.

### Record, edit and download

Capture footage using [**Tella**](https://www.tella.tv/) for desktop recordings and [**Bezel**](https://nonstrict.eu/bezel/) for mirroring and recording mobile device screens.

- **Tella** offers a flexible editing environment where you can trim, rearrange, or replace sections with ease.

- For mobile recordings, **Bezel** mirrors the device screen onto your computer, ensuring high-quality visuals.



<figure>
  <img src="/images/Screenshot_2024-11-18_at_21.58.44.png.webp" alt="Multiple recordings in Tella edit mode">
  <figcaption>Multiple recordings in Tella edit mode</figcaption>
</figure>

### Post processing

Extract the original audio using **FFmpeg**:

```bash
ffmpeg -i original_video.mp4 -q:a 0 -map a output_audio.mp3
```



Use [Eleven Labs](https://elevenlabs.io/) to replace the audio with a professional-quality voiceover. For instance, I prefer the River voice option. 

<figure>
  <img src="/images/Screenshot_2024-11-14_at_10.22.04.png.webp" alt="Eleven Labs voice changer">
  <figcaption>Eleven Labs voice changer</figcaption>
</figure>

Upload the extracted audio, generate the new version, and save it as `main_audio.mp3`.



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



## **Guidelines for tutorial design**

To ensure a professional and visually appealing result:

- Use a gradient background for a polished aesthetic.

- Keep the layout minimal and uncluttered.

- Use zoom effects to emphasize important details.

- Add pleasant, non-intrusive background music to enhance the viewing experience.



Here’s the output video: 

[https://www.tella.tv/video/how-to-redeem-groupon-vouchers-ai-generated-voice-9emu](https://www.tella.tv/video/how-to-redeem-groupon-vouchers-ai-generated-voice-9emu)



Creating tutorials can be a rewarding process, allowing you to share knowledge in an engaging and professional way. Happy creating! 


