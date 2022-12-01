import { Lambda } from 'aws-sdk'
import { APIGatewayProxyHandler } from 'aws-lambda'
import qs from 'qs'
import { TelegramBot } from 'telegram-bot-nodejs'
import { stateMachine } from './stateMachine'

const client = new Lambda()

export const main: APIGatewayProxyHandler = async (event): Promise<any> => {
  console.log('[Started] Telegram chat bot!')
  if (!event.body) throw new Error('Invalid Payload')
  const body = JSON.parse(event.body)
  console.log('[body] ', body)

  if (body.edited_message) {
    // Ignoring edited message
    return { statusCode: 200 }
  }

  const { chat, message_id, text } = body.message

  const token = process.env.TELEGRAM_TOKEN ?? ''

  const bot = new TelegramBot(token, chat.id)

  if (!chat.id) {
    // != '5186036474'
    const options = qs.stringify({
      chat_id: chat.id,
      text: `Olá, desculpe o transtorno mas meu criador desligou meu "cérebro"
então não consigo pensar agora 😔, tente novamente mais tarde!`,
      reply_to_message_id: message_id,
    })

    await bot.publicCall('sendMessage', options)
  } else {
    if (text) {
      try {
        let message = ''
        let intention = ''
        let status = ''
        let newStatus = ''
        switch (text) {
          case '/start':
          case '/help':
            {
              message = `*UFMS Lab - Pizzaria 3000 (ChatBot)*
Alison Vilela

Estamos em teste, a inteção capturada irá aparecer no final de toda mensagem.

*Available commands*
- /start - /help -> Mensagem de boas vindas e informações de como eu funciono.
- /intencoes -> Lista as intenções que eu consigo entender.
- /modelo -> Mostra o modelo que estou usando para ganhar vida.`
            }
            break
          case '/intencoes':
            {
              message = `*Intenções que consigo entender* (ainda aprendendo!)
- Apresentações
- Cardápio
- Tempo de entrega
- Horário de funcionamento
- Realizar pedidos
- Confirmar pedido
- Cancelar pedido`
            }
            break
          case '/model':
            {
              message = 'neuralmind/bert-base-portuguese-cased'
            }
            break
          default:
            {
              const classificationResult = await client
                .invoke({
                  FunctionName: `pizzaria-3000-api-${process.env.ENV}-inference`,
                  InvocationType: 'RequestResponse',
                  LogType: 'Tail',
                  Payload: JSON.stringify({
                    telegram_message: text,
                  }),
                })
                .promise()

              const classificationString = Buffer.from(classificationResult.Payload as any).toString('utf8')
              const classification = JSON.parse(classificationString)
              intention = classification.body

              const stateMachineResult = await stateMachine(chat, intention, text)
              message = stateMachineResult.message
              status = stateMachineResult.status
              newStatus = stateMachineResult.newStatus
            }
            break
        }

        const options = qs.stringify({
          chat_id: chat.id,
          text: `${message.replace('_', '\\_')}` + `\n\n(${intention.replace('_', '\\_')}|${status}|${newStatus})`,
          parse_mode: 'markdown',
        })
        await bot.publicCall('sendMessage', options)
      } catch (e) {
        console.log('[ERROR] ', e)
        await bot.sendMessage('Eu tive um problema sério no servidor, tente novamente mais tarde!')
      }
    } else {
      const options = qs.stringify({
        chat_id: chat.id,
        text: 'Eu ainda não sei entender isso, me desculpa 😔',
        reply_to_message_id: message_id,
      })

      await bot.publicCall('sendMessage', options)
    }
  }
  console.log('[Finished] Telegram chat bot!')
  return { statusCode: 200 }
}
