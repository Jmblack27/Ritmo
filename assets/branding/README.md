# Ritmo · Pulso

Selected by the user from the icon concepts. Images generated with the built-in image generation tool; platform sizes exported with Expo image utilities.

- `pulso-source.png`: original selected transparent mark.
- `pulso-icon-source.png`: opaque green icon master.
- `icon.png`: 1024 × 1024 opaque app icon for iOS and the default Expo icon.
- `adaptive-foreground.png`: 1024 × 1024 transparent Android foreground, with extra padding for launcher masks.
- `splash.png`: transparent launch-screen mark.
- `favicon.png`: 64 × 64 web icon.

Final image prompt:

> Use the displayed mint ascending wave icon as the edit target. Preserve exactly its rounded wave silhouette, orientation and identity. Clean any speckled edges. Center it on completely opaque solid forest green #173C2B full square background. Output 1024x1024 square PNG, no transparency anywhere, no rounded outer corners, no mockup, no text, no shadows. Keep the entire mint mark inside central 60% width and height for circular launcher safety. Flat mint #6DD6A2 mark. Final production Ritmo icon.

The generated master was normalized to 1024 × 1024 for the app icon. App references are configured in `app.json`. A new native build is required to update installed launcher icons and splash screens.

The existing EAS `production` profile generates store builds and increments build numbers remotely. JavaScript export validation is not a signed native build or a store release.
