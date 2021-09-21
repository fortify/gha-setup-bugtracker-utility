import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

const INPUT_VERSION = 'version';
const TOOL_NAME = 'FortifyBugTrackerUtility';

function getDownloadUrl(version: string): string {
  return `https://github.com/fortify-ps/fortifyBugTrackerUtility/releases/download/${version}/FortifyBugTrackerUtility-${version}-dist.zip`;
}

async function downloadAndExtract(url: string): Promise<string> {
  core.debug("Downloading " + url);
  const toolZip = await tc.downloadTool(url);
  core.debug("Extracting " + toolZip);
  const extractPath = await tc.extractZip(toolZip);
  return extractPath;
}

async function installAndCache(version: string): Promise<string> {
  const toolRootDir = await downloadAndExtract(getDownloadUrl(version));
  const toolBinDir = path.join(toolRootDir, 'bin');
  const cachedRootDir = await tc.cacheDir(toolRootDir, TOOL_NAME, version);
  return cachedRootDir;
}

async function getCachedRootDir(version: string): Promise<string> {
  var cachedToolPath = tc.find(TOOL_NAME, version);
  if (!cachedToolPath) {
    cachedToolPath = await installAndCache(version);
    core.info('Successfully installed ' + TOOL_NAME + " version " + version);
  }
  return cachedToolPath;
}

async function main(): Promise<void> {
  try {
    core.startGroup('Setup Fortify ScanCentral Client');
    const version = core.getInput(INPUT_VERSION);
    const toolDir = await getCachedRootDir(version);
    const toolJar = path.join(toolDir, `FortifyBugTrackerUtility-${version}.jar`);
    core.exportVariable('FBTU_JAR', toolJar);
    core.exportVariable('FBTU_DIR', toolDir);
  } catch (err) {
    core.setFailed("Action failed with error ${err}");
  } finally {
    core.endGroup();
  }
}

main();