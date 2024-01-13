# Ignite Gym App 🏋️

<img width="180" src="https://github.com/luismda/ignite-gym/assets/88680118/c767d13a-c1a2-48a5-be48-d2e5ae51450d" alt="" />
<img width="180" src="https://github.com/luismda/ignite-gym/assets/88680118/e07f58da-ed6b-4b24-af46-374d9482ebea" alt="" />
<img width="180" src="https://github.com/luismda/ignite-gym/assets/88680118/d8e4cce2-8bfd-4c8c-952c-aa85f8653f70" alt="" />
<img width="180" src="https://github.com/luismda/ignite-gym/assets/88680118/74008d98-e3db-4063-9f37-f579d8ebdf05" alt="" />
<img width="180" src="https://github.com/luismda/ignite-gym/assets/88680118/7ba35184-e604-4360-9072-34f71dea803c" alt="" />
<img width="180" src="https://github.com/luismda/ignite-gym/assets/88680118/f05668ee-38c4-4d68-94f6-81c1f300a843" alt="" />
<img width="180" src="https://github.com/luismda/ignite-gym/assets/88680118/b109c596-530c-4b76-ba44-dad1ad060c38" alt="" />
<img width="180" src="https://github.com/luismda/ignite-gym/assets/88680118/8b9826a1-9169-4853-b4b5-28b73e918b84" alt="" />

---

## About

Ignite Gym is a mobile app with lots of gym exercises, separated by muscle group, with instructions on how to do them. 

In addition, you can mark a exercise as completed and view all completed exercises in history, grouped by day. In the application, it is possible to create a new account and log in, as well as edit your profile, as well as update your avatar.

This app uses a refresh token strategy to keep the user signed in and the auth flow uses a JWT.

The **push notification strategy** was also implemented to remind the user to practice or even notify about a new exercise. Additionally, **deep linking** was also implemented to redirect based on notifications.

The project was developed using these technologies:

- TypeScript
- React Native
- Expo Dev Client
- Expo Image Picker (*used to select and edit user avatar*)
- NativeBase (*component library*)
- React Navigation (*stack and tab navigation*)
- Axios (*HTTP client*)
- Async Storage (*used to local storage of user and token*)
- One Signal (*used to send push notifications*)
- Firebase Cloud Messaging (*used with One Signal to send notifications on Android devices*)
- React Hook Form
- Zod

Finally, this project was developed in the React Native training in the [**Rocketseat**](https://github.com/rocketseat-education) **Ignite** course. The main purpose of this app was to practice using a **component library, such as NativeBase, and bottom tab navigation, as well as backend integration, with authentication flow**. In addition, it was possible to practice using the **Context API and React Hooks**, always following good coding practices.

[**Access the project layout in Figma**](https://www.figma.com/community/file/1163926136397847279)

## Instructions

- Requirements:
  - [Node.js LTS](https://nodejs.org/en)

1. Clone the repository and install the dependencies:

```sh
git clone https://github.com/luismda/ignite-gym.git
```

```sh
npm i
```

2. Clone the back-end project used in this app (created by [rodrigorgtic](https://github.com/rodrigorgtic/ignitegym-api)) and install the dependencies:

```sh
git clone https://github.com/rodrigorgtic/ignitegym-api.git
```

```sh
npm i
```

3. Run back-end server:

```sh
npm start
```

4. Configure the env variables following the `.env.example` file (API URL and One Signal App ID)

5. Run development build:

```sh
npm run android
# or
npm run ios
```

6. Start app

```sh
npm start
```

6. To preview the app, you can use Expo Go on your physical device or use an Android or iPhone emulator on your computer. See some more details in the [**React Native**](https://reactnative.dev/docs/environment-setup?guide=quickstart) and [**Expo**](https://docs.expo.dev/get-started/expo-go/) documentation.

## Created by

Luís Miguel | [**LinkedIn**](https://www.linkedin.com/in/luis-miguel-dutra-alves/)

##

**#NeverStopLearning 🚀**
