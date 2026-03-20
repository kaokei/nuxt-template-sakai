export default {
  '*.{js,ts,jsx,tsx,vue,css,scss,json,md}': [
    // `--ignore-unknown` prevents Prettier from exiting non-zero for
    // unknown file types; safe guard when lint-staged runs on unexpected files
    'prettier --write --ignore-unknown --no-error-on-unmatched-pattern',
  ],
};
