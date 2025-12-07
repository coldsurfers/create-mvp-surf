import { execSync } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isValidNodeModulePackage = (packageName) => {
  return !packageName.startsWith('.');
};

const nodeModulesLayers = {
  nodeModules: {
    copyDirs: [],
    isDefault: true,
    path: '.node-modules-layer',
  },
  prisma: {
    copyDirs: [
      {
        name: '.prisma',
        relativePath: '../../node_modules/.prisma',
      },
      { name: '@prisma', relativePath: 'node_modules/@prisma' },
    ],
    path: '.prisma-layer',
  },
  // sharpImg: {
  //   copyDirs: [
  //     {
  //       name: '@img',
  //       relativePath: 'node_modules/@img',
  //     },
  //   ],
  //   path: '.img-modules-layer',
  // },
};

if (Object.keys(nodeModulesLayers).length > 5) {
  throw new Error('Only 5 layers can be allowed');
}

const runCommand = (command) => {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing: ${command}\n`, error);
    /**
     * skip process exit
     */
    // process.exit(1)
  }
};

runCommand('rm -rf .serverless');
Object.entries(nodeModulesLayers).forEach(([, { path }]) => {
  runCommand(`rm -rf ${path}`);
});

// Execute commands sequentially
runCommand('pnpm install:sharp');
runCommand('pnpm build');
runCommand('node ./src/scripts/serverless-monorepo.js');
runCommand('pnpm prisma:generate');

Object.entries(nodeModulesLayers).forEach(([, { isDefault, copyDirs, path }]) => {
  if (isDefault) {
    runCommand(`mkdir -p ${path}/nodejs`);
    runCommand(`cp -r node_modules ${path}/nodejs`);
    const otherLayers = Object.entries(nodeModulesLayers).filter(([, layerInfo]) => {
      return !layerInfo.isDefault;
    });
    otherLayers.forEach(([, layerInfo]) => {
      const otherLayerCopyDirs = layerInfo.copyDirs.map((copyDir) => copyDir);
      otherLayerCopyDirs.forEach((otherLayerCopyDir) => {
        if (isValidNodeModulePackage(otherLayerCopyDir.name)) {
          runCommand(`rm -rf ${path}/nodejs/node_modules/${otherLayerCopyDir.name}`);
        }
      });
    });
  } else {
    copyDirs.forEach((copyDir) => {
      // make dir
      runCommand(`mkdir -p ${path}/nodejs/node_modules/${copyDir.name}`);
      // copy dir
      runCommand(`cp -r ${copyDir.relativePath} ${path}/nodejs/node_modules`);
    });
  }
});
