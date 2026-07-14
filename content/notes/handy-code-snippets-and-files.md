---
title: "Handy code snippets and files"
date: "2023-09-16"
description: "If LLMs stop working one day, this is where I go"
tags:
- code
---

## Trang’s profile picture

<a class="file-download" href="/files/39d8d0a55f27803789cdee2e2f710cdc-trang-vu-profile-picture.JPEG.jpeg" download="trang-vu-profile-picture.JPEG.jpeg">
  <svg class="file-download-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M12 17.5v-5" />
    <path d="m9.5 14.5 2.5-2.5 2.5 2.5" />
  </svg>
  <span class="file-download-name">trang-vu-profile-picture.JPEG.jpeg</span>
  <span class="file-download-size">470 KiB</span>
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




