const { existsSync } = require('fs');
const { homedir } = require('os');
const { join } = require('path');

class chaingreenConfigDetector {
  chaingreenConfigExistsForConfigDirectory(configDirectory) {
    return existsSync(this.getchaingreenConfigFilePath(configDirectory));
  }

  get defaultchaingreenConfigExists() {
    return this.chaingreenConfigExistsForConfigDirectory(this.defaultchaingreenConfigDirectory);
  }

  getchaingreenConfigFilePath(configDirectory) {
    return join(configDirectory, 'config', 'config.yaml');
  }

  get defaultchaingreenConfigDirectory() {
    return join(homedir(), '.chaingreen', 'mainnet');
  }
}

module.exports = new chaingreenConfigDetector();
