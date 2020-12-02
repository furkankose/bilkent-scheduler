import fs from "fs";
import http from "isomorphic-git/http/node";

const config = {
  fs,
  http,
  remote: "origin",
  ref: process.env.GH_BRANCH,
  dir: process.env.PROJECT_PATH,
  author: {
    name: process.env.GH_AUTHOR_NAME,
    email: process.env.GH_AUTHOR_EMAIL,
  },
  onAuth: () => ({ username: process.env.GH_TOKEN }),
};

export default config;
