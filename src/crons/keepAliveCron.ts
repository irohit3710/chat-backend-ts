import axios from 'axios';
import cron from 'node-cron'
import { CONFIG } from '../config/environment';
import chalk from 'chalk';

export class KeepAliveCron {
  static async FourteenMinReqCron() {
    // console.log(chalk.blue('KeepAlive running....'));
    console.log('\x1b[36m%s\x1b[0m', "KeepAlive running....")
    axios.get(CONFIG.aliveUrl)
      .then(response => {
        console.log('\x1b[32m%s\x1b[0m', 'Ping successful');
        // console.log(chalk.green('Ping Successful'));
      })
      .catch(error => {
        console.error('Error pinging the server:', error);
      });
  }
}