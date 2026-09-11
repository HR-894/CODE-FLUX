---
name: Expo preview environment
description: Expo workflow behavior when React Native DevTools cannot load
---

The managed Expo preview may print a React Native DevTools installation error caused by a missing host `libglib` shared library while Metro, the QR code, and the web preview continue serving.

**Why:** This is a host tooling warning rather than an application bundle failure, so changing app code or Expo dependencies is not the right first response.

**How to apply:** Confirm Metro has started and the preview URL is available before treating this message as a mobile app crash.