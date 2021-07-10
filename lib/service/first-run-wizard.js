const prompts = require('prompts');
const { validate } = require('uuid');

const config = require('./config');
const chaingreenConfigDetector = require('./chia-config-detector');
const ChaingreenDashboardClient = require('../chia-dashboard-client');

class FirstRunWizard {
  async run() {
    const { apiKey } = await prompts([{
      type: 'text',
      name: 'apiKey',
      message: `Please enter the api key for this satellite`,
      validate: (input) => validate(input) ? true : 'Not a valid api key!',
    }]);
    if (!apiKey) {
      process.exit(0);
    }
    const { dashboardCoreUrl, dashboardCoreUrlManual } = await prompts([{
      type: 'select',
      name: 'dashboardCoreUrl',
      message: `Please select the dashboard url you want to use`,
      choices: [
        { title: 'https://eu.chiadashboard.com', value: 'https://eu.chiadashboard.com' },
        { title: 'https://us.chiadashboard.com', value: 'https://us.chiadashboard.com' },
        // { title: 'https://chia-dashboard-api.foxypool.io', value: 'https://chia-dashboard-api.foxypool.io' },
        { title: 'Enter an url manually', value: 'manual' },
      ],
      initial: 0,
    }, {
      type: prev => prev === 'manual' ? 'text' : null,
      name: 'dashboardCoreUrlManual',
      message: `Please enter the dashboard url you want to use`,
      validate: async (input) => {
        const client = new ChaingreenDashboardClient({ dashboardCoreUrl: input, timeout: 10 * 1000 });
        try {
          await client.ping();
          return true;
        } catch (err) {
          return 'Please enter a valid dashboard url';
        }
      },
    }]);
    const chaingreenDashboardCoreUrl = dashboardCoreUrl !== 'manual' ? dashboardCoreUrl : dashboardCoreUrlManual;
    if (!chaingreenDashboardCoreUrl) {
      process.exit(0);
    }
    let chaingreenConfigDirectory = chaingreenConfigDetector.defaultchaingreenConfigDirectory;
    if (!chaingreenConfigDetector.defaultchaingreenConfigExists) {
      const { chaingreenConfigDirectoryFromPrompt } = await prompts([{
        type: 'text',
        name: 'chaingreenConfigDirectoryFromPrompt',
        message: `Please enter the path to your chaingreen config directory`,
        initial: chaingreenConfigDirectory,
        validate: (input) => chaingreenConfigDetector.chaingreenConfigExistsForConfigDirectory(input.trim()) ? true : 'Not a valid chaingreen config directory!',
      }]);
      if (!chaingreenConfigDirectoryFromPrompt) {
        process.exit(0);
      }
      chaingreenConfigDirectory = chaingreenConfigDirectoryFromPrompt.trim();
    }

    config.config = {
      chaingreenConfigDirectory,
      chaingreenDashboardCoreUrl,
      apiKey,
    };
    await config.save();
  }
}

module.exports = new FirstRunWizard();
