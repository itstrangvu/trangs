---
title: "Handy code snippets"
date: "2023-09-16"
description: "If LLMs stop working one day, this is where I go"
tags:
- code
---

## **Sleep on Mac**

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




