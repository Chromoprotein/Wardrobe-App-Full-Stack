# Capsule wardrobe website

This is a capsule wardrobe website for generating random outfits from the user's wardrobe.

Tech stack: React / TypeScript / Node.js / MongoDB

## Features:

- You can upload clothes you own, including pictures.

- You can generate random outfits from your wardrobe, applying rules like formality, season, and color.

- You can track how often you've worn certain clothes by clicking "wear" on an outfit or updating it manually.

- You can track the cost per wear of clothes.

Tech stack: React, Axios, Node.js (Express, JWT), Typescript, MongoDB.

## Folders and files

Auth: backend functions for login and registration.

Basic: backend functions for wardrobe-related actions.

middleware: authentication middleware. The website uses JWT for server-side user authentication.

Schemas: schemas folder.

node-practice-frontend: frontend folder.

- node-practice-frontend/src/components: React components.

* ClothingFormLogic.tsx and ClothingEditLogic.tsx: logic for uploading and updating/deleting clothes, respectively.

* ClothingForm.tsx: clothing form UI.

* Login.tsx and Regiter.tsx: login and registration logic.

* UserForm.tsx: registration/login form UI.

* GenerateOutfits.tsx: UI for the outfit generating page.

- node-practice-frontend/src/components/interfaces: TypesScript interfaces.

- node-practice-frontend/src/contexts: Context API.

- node-practice-frontend/src/dummyData: arrays for form options etc.

- node-practice-frontend/src/img: placeholder images for when the user hasn't uploaded their own.

- node-practice-frontend/src/utils: hooks and helper functions.

* outfitsRandomizer.tsx: outfit randomization logic.

## My to-do list:

- Make it more mobile friendly, e.g. the logo is too big now

- Place restrictions on images

- Route protection on client-side too so users don't navigate where they shouldn't go and see a blank page

- Sort clothes by most/least worn, best/worst cost per wear, newest/oldest

- Custom error page

- Organize folders, e.g. make a Schemas folder

- there's a bug that keeps the login button disabled when the user auto-fills the credentials