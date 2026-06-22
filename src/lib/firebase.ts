/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaPUK6tgpzhwJ6vS5RSGIg8Lz--N_1Rvs",
  authDomain: "cimaglow-9b4cb.firebaseapp.com",
  databaseURL: "https://cimaglow-9b4cb-default-rtdb.firebaseio.com",
  projectId: "cimaglow-9b4cb",
  storageBucket: "cimaglow-9b4cb.firebasestorage.app",
  messagingSenderId: "591283612537",
  appId: "1:591283612537:web:37abc95a887a1992791da8",
  measurementId: "G-4Q884W31D9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
