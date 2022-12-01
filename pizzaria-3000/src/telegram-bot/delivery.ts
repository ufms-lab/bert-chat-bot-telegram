import { Lambda } from 'aws-sdk'
import { SQSHandler } from 'aws-lambda'
import qs from 'qs'
import { TelegramBot } from 'telegram-bot-nodejs'
import { updateUserStatus } from './stateMachine'

const client = new Lambda()

export const main: SQSHandler = async (event): Promise<any> => {
  console.log('[event] ', event)

  // await updateUserStatus(chat.id, chat.first_name, newStatus)
}
