const {execSync} = require('child_process');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const ask = query => new Promise(resolve => rl.question(query, resolve));

const fs = require('fs');

const getAndroidBuildInfo = () => {
  const data = fs.readFileSync('./android/app/build.gradle', 'utf8');
  const versionName = /versionName "(.*)"/.exec(data)[1];
  const applicationId = /applicationId "(.*)"/.exec(data)[1];
  const versionCode = /versionCode (.*)/.exec(data)[1];
  return {versionName, versionCode, applicationId};
};

const uploadSourceMap = (versionName, versionCode, applicationId) => {
  const release = `${applicationId}@${versionName}+${versionCode}`;
  console.log('SOURCEMAP: STEP 0/5 COMPLETED!');
  execSync(
    'npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output index.android.bundle --sourcemap-output index.android.bundle.packager.map',
  );
  console.log('SOURCEMAP: STEP 1/5 COMPLETED!');
  execSync(
    'node_modules/hermes-engine/osx-bin/hermesc -O -emit-binary -output-source-map -out=index.android.bundle.hbc index.android.bundle',
    {maxBuffer: 1024 * 1024 * 1024},
  );
  console.log('SOURCEMAP: STEP 2/5 COMPLETED!');
  execSync(
    'node node_modules/react-native/scripts/compose-source-maps.js index.android.bundle.packager.map index.android.bundle.hbc.map -o index.android.bundle.map',
  );
  console.log('SOURCEMAP: STEP 3/5 COMPLETED!');
  console.log('UPLOADING SOURCEMAPS... This may take a few minutes');
  execSync(`node_modules/@sentry/cli/bin/sentry-cli releases \
    files ${release} \
    upload-sourcemaps \
    --dist ${versionCode} \
    --strip-prefix /home/lucas/code/cobertec/app-cobertec \
    --rewrite index.android.bundle index.android.bundle.map`);

  /*
      execSync(`node_modules/@sentry/cli/bin/sentry-cli releases \
    files ${release} \
    upload-sourcemaps \
    --dist ${versionCode} \
    --bundle index.android.bundle \
    --bundle-sourcemap index.android.bundle.map`);
    */
  console.log('SOURCEMAP: STEP 4/5 COMPLETED!');
  fs.unlinkSync('index.android.bundle');
  fs.unlinkSync('index.android.bundle.hbc');
  fs.unlinkSync('index.android.bundle.hbc.map');
  fs.unlinkSync('index.android.bundle.map');
  fs.unlinkSync('index.android.bundle.packager.map');
  console.log('SOURCEMAP: STEP 5/5 COMPLETED!');
  console.log('SOURCE MAP UPLOADED!');
};

const updateAndroidBuildInfo = (
  versionName,
  nextVersionName,
  versionCode,
  nextVersionCode,
) => {
  const buildGradleData = fs.readFileSync('./android/app/build.gradle', 'utf8');
  let updatedGadleData = buildGradleData
    .replace(`versionName "${versionName}"`, `versionName "${nextVersionName}"`)
    .replace(`versionCode ${versionCode}`, `versionCode ${nextVersionCode}`);
  fs.writeFileSync('./android/app/build.gradle', updatedGadleData);
};

const buildApk = () =>
  execSync('cd android && ./gradlew assembleRelease && cd ..', {
    maxBuffer: 1024 * 1024 * 1024,
  });

const buildAab = () =>
  execSync('cd android && ./gradlew bundleRelease && cd ..', {
    maxBuffer: 1024 * 1024 * 1024,
  });

const createBranchAndCommit = versionName => {
  execSync(`git checkout -b ${versionName}`);
  execSync('git add .');
  execSync(`git commit -m "version ${versionName}"`);
  execSync(`git push -u origin ${versionName}`);
};

const mergeChangesToDevelop = versionName => {
  execSync(`git checkout develop`);
  execSync(`git merge ${versionName}`);
  execSync(`git push`);
};

const main = async () => {
  try {
    const {versionName, versionCode, applicationId} = getAndroidBuildInfo();
    const shouldBuildApkResponse = await ask(
      'Do you want to build an apk? (y/n): ',
    );
    const shouldBuildApk =
      shouldBuildApkResponse === 'y' || shouldBuildApkResponse === 'Y';
    const shouldBuildAabResponse = await ask(
      'Do you want to build an aab? (y/n): ',
    );
    const shouldBuildAab =
      shouldBuildAabResponse === 'y' || shouldBuildAabResponse === 'Y';
    const shouldUploadSourcemapResponse = await ask(
      'Do you want to generate sourcemaps? (y/n): ',
    );
    const shouldUploadSourcemap =
      shouldUploadSourcemapResponse === 'y' ||
      shouldUploadSourcemapResponse === 'Y';

    const shouldCreateBranchResponse = await ask(
      'Do you want to create a new branch for this version? (y/n): ',
    );
    const shouldCreateBranch =
      shouldCreateBranchResponse === 'y' || shouldCreateBranchResponse === 'Y';

    if (!shouldBuildAab && !shouldBuildApk && !shouldUploadSourcemap) {
      return;
    }
    const nextVersionName = await ask(
      `Enter versionName (current versionName is ${versionName}): `,
    );
    const nextVersionCode = await ask(
      `Enter versionCode (current versionCode is ${versionCode}): `,
    );

    console.log('UPDATING ANDROID BUILD INFO...');
    if (shouldBuildAab || shouldBuildApk) {
      updateAndroidBuildInfo(
        versionName,
        nextVersionName,
        versionCode,
        nextVersionCode,
      );
    }
    if (shouldCreateBranch) {
      createBranchAndCommit(nextVersionName);
      mergeChangesToDevelop(nextVersionName);
    }
    if (shouldBuildApk) {
      console.log('BUILDING APK...');
      buildApk();
    }
    if (shouldBuildAab) {
      console.log('BUILDING AAB...');
      buildAab();
    }
    if (shouldUploadSourcemap) {
      uploadSourceMap(nextVersionName, nextVersionCode, applicationId);
    }
    console.log('SUCCESS! :)');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

main();
