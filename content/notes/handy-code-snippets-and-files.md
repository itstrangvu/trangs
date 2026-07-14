---
title: "Handy code snippets and files"
date: "2023-09-16"
description: "If LLMs stop working one day, this is where I go"
tags:
- code
---

## Trang’s profile picture

<a class="file-download" href="/files/39d8d0a55f27803789cdee2e2f710cdc-trang-vu-profile-picture.JPEG.jpeg" download="trang-vu-profile-picture.JPEG.jpeg">
  <svg class="file-download-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 3v12" />
    <path d="m7 12 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
  <span class="file-download-text">
    <span class="file-download-name">trang-vu-profile-picture.JPEG.jpeg</span>
    <span class="file-download-hint">Download</span>
  </span>
</a>



## Sleep on Mac

Disable sleeping when the lid is closed running on battery

```bash
sudo pmset -b sleep 0; sudo pmset -b disablesleep 1
```



Re-enable sleeping when the lid is closed running on battery

```bash
sudo pmset -b sleep 5; sudo pmset -b disablesleep 0
```



## **Hidden files in Finder**

Show hidden files

```bash
defaults write com.apple.finder AppleShowAllFiles TRUE
```

```bash
killall Finder
```



Hide hidden files

```bash
defaults write com.apple.finder AppleShowAllFiles FALSE
```

```bash
killall Finder
```




