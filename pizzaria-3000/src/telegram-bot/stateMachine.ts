import { SQS } from 'aws-sdk'

import { ChatEntity } from './dynamoDB'
import { PHRASES } from './phrases'

const client = new SQS()

const CARDAPIO = `*Cardápio 3000*
- Pizza de óleo de motor
- Suco de Bateria`

export const stateMachine = async (chat: any, intention: any, text: any): Promise<any> => {
  const user = await getUser(chat.id)

  let result = ''
  let status = 'null'
  let newStatus = 'new'

  if (user) {
    status = user['status']
  }
  console.log('[INTENTION] ', intention)

  console.log('[STATUS]')
  switch (status) {
    case 'new': {
      console.log('[NEW]')
      switch (intention) {
        case 'apresentacao': {
          result = PHRASES.new.apresentacao[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'cancelar_pedido': {
          result = PHRASES.new.cancelar_pedido[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'cardapio': {
          result = PHRASES.new.cardapio[getRandomInt(3)]
            .replace('<name>', chat.first_name)
            .replace('<cardapio>', CARDAPIO)
          break
        }
        case 'confirmar_pedido': {
          result = PHRASES.new.confirmar_pedido[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'fazer_pedido': {
          result = PHRASES.new.fazer_pedido[getRandomInt(1)].replace('<name>', chat.first_name)
          newStatus = 'ordering'
          break
        }
        case 'horario_funcionamento': {
          result = PHRASES.new.horario_funcionamento[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'tempo_entrega': {
          result = PHRASES.new.tempo_entrega[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'sim':
        case 'nao':
        default: {
          result = PHRASES.error
          break
        }
      }
      break
    }
    case 'ordering': {
      console.log('[ORDERING]')
      switch (intention) {
        case 'apresentacao': {
          result = PHRASES.ordering.apresentacao[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'cancelar_pedido': {
          result = PHRASES.ordering.cancelar_pedido[getRandomInt(3)].replace('<name>', chat.first_name)
          newStatus = 'idle'
          break
        }
        case 'cardapio': {
          result = PHRASES.ordering.cardapio[getRandomInt(3)]
            .replace('<name>', chat.first_name)
            .replace('<cardapio>', CARDAPIO)
          break
        }
        case 'confirmar_pedido': {
          result = PHRASES.ordering.confirmar_pedido[getRandomInt(3)].replace('<name>', chat.first_name)
          newStatus = 'waiting'
          /*
          const params = {
            QueueUrl: 'https://sqs.us-east-2.amazonaws.com/362055834550/DeliveryQueue.fifo',
            MessageBody: `
              {
                'user_id': ${chat.id},
                'new_status': ${'receiving'},
              }
            `,
          }

          const sqsResult = await client.sendMessage(params).promise()

          console.log('[SQS] ', sqsResult)*/
          break
        }
        case 'fazer_pedido': {
          result = PHRASES.ordering.fazer_pedido[getRandomInt(1)].replace('<name>', chat.first_name)
          break
        }
        case 'horario_funcionamento': {
          result = PHRASES.ordering.horario_funcionamento[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'tempo_entrega': {
          result = PHRASES.ordering.tempo_entrega[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'sim':
        case 'nao':
        default: {
          result = PHRASES.error
          break
        }
      }
      break
    }
    case 'waiting': {
      console.log('[WAITING]')
      switch (intention) {
        case 'apresentacao': {
          result = PHRASES.waiting.apresentacao[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'cancelar_pedido': {
          result = PHRASES.waiting.cancelar_pedido[getRandomInt(3)].replace('<name>', chat.first_name)
          newStatus = 'idle'
          break
        }
        case 'cardapio': {
          result = PHRASES.waiting.cardapio[getRandomInt(3)]
            .replace('<name>', chat.first_name)
            .replace('<cardapio>', CARDAPIO)
          break
        }
        case 'confirmar_pedido': {
          result = PHRASES.waiting.confirmar_pedido[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'fazer_pedido': {
          result = PHRASES.waiting.fazer_pedido[getRandomInt(1)].replace('<name>', chat.first_name)
          break
        }
        case 'horario_funcionamento': {
          result = PHRASES.waiting.horario_funcionamento[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'tempo_entrega': {
          result = PHRASES.waiting.tempo_entrega[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'sim':
        case 'nao':
        default: {
          result = PHRASES.error
          break
        }
      }
      break
    }
    case 'receiving': {
      console.log('[RECEIVING]')
      switch (intention) {
        case 'apresentacao': {
          result = PHRASES.receiving.apresentacao[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'cancelar_pedido': {
          result = PHRASES.receiving.cancelar_pedido[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'cardapio': {
          result = PHRASES.receiving.cardapio[getRandomInt(3)]
            .replace('<name>', chat.first_name)
            .replace('<cardapio>', CARDAPIO)
          break
        }
        case 'confirmar_pedido': {
          result = PHRASES.receiving.confirmar_pedido[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'fazer_pedido': {
          result = PHRASES.receiving.fazer_pedido[getRandomInt(1)].replace('<name>', chat.first_name)
          break
        }
        case 'horario_funcionamento': {
          result = PHRASES.receiving.horario_funcionamento[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'tempo_entrega': {
          result = PHRASES.receiving.tempo_entrega[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'sim':
        case 'nao':
        default: {
          result = PHRASES.error
          break
        }
      }
      break
    }
    case 'idle': {
      console.log('[IDLE]')
      switch (intention) {
        case 'apresentacao': {
          result = PHRASES.idle.apresentacao[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'cancelar_pedido': {
          result = PHRASES.idle.cancelar_pedido[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'cardapio': {
          result = PHRASES.idle.cardapio[getRandomInt(3)]
            .replace('<name>', chat.first_name)
            .replace('<cardapio>', CARDAPIO)
          break
        }
        case 'confirmar_pedido': {
          result = PHRASES.idle.confirmar_pedido[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'fazer_pedido': {
          result = PHRASES.idle.fazer_pedido[getRandomInt(1)].replace('<name>', chat.first_name)
          newStatus = 'ordering'
          break
        }
        case 'horario_funcionamento': {
          result = PHRASES.idle.horario_funcionamento[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'tempo_entrega': {
          result = PHRASES.idle.tempo_entrega[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'sim':
        case 'nao':
        default: {
          result = PHRASES.error
          break
        }
      }
      break
    }
    default: {
      console.log('[NULL - DEFAULT]')
      switch (intention) {
        case 'apresentacao': {
          result = PHRASES.null.apresentacao[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'cancelar_pedido': {
          result = PHRASES.null.cancelar_pedido[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'cardapio': {
          result = PHRASES.null.cardapio[getRandomInt(3)]
            .replace('<name>', chat.first_name)
            .replace('<cardapio>', CARDAPIO)
          break
        }
        case 'confirmar_pedido': {
          result = PHRASES.null.confirmar_pedido[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'fazer_pedido': {
          result = PHRASES.null.fazer_pedido[getRandomInt(1)].replace('<name>', chat.first_name)
          newStatus = 'ordering'
          break
        }
        case 'horario_funcionamento': {
          result = PHRASES.null.horario_funcionamento[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'tempo_entrega': {
          result = PHRASES.null.tempo_entrega[getRandomInt(3)].replace('<name>', chat.first_name)
          break
        }
        case 'sim':
        case 'nao':
        default: {
          result = PHRASES.error
          break
        }
      }
      break
    }
  }

  await updateUserStatus(chat.id, chat.first_name, newStatus)

  return { result, status, newStatus }
}

const getUser = async (chat_id: any): Promise<any> => {
  console.log('[getUser]')

  const primaryKey = {
    id: chat_id,
    sk: 'USER',
  }

  const result = await ChatEntity.get(primaryKey)

  console.log('[getUser] result - ', result.Item)

  return result.Item
}

export const updateUserStatus = async (chat_id: any, user_name: string, status: string): Promise<any> => {
  console.log('[updateUser]')

  const user = {
    id: chat_id,
    sk: 'USER',
    name: user_name,
    status: status,
  }

  const result = await ChatEntity.put(user)

  console.log('[updateUser] result - ', result)

  return result
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max)
}
