export default {
  extends: '@istanbuljs/nyc-config-typescript',
  'check-coverage': true,
  branches: 100,
  functions: 100,
  lines: 100,
  statements: 100
};
