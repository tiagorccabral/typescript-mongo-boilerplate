#!/bin/sh

yarn install

yarn remove bcrypt
yarn add bcrypt

yarn dev
