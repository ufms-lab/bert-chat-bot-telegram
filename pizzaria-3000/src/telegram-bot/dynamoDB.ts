import { Table, Entity } from 'dynamodb-toolbox'

import DynamoDB from 'aws-sdk/clients/dynamodb'

const DocumentClient = new DynamoDB.DocumentClient({
  convertEmptyValues: false,
})

const ChatTable = new Table({
  name: 'pizzaria3000',
  partitionKey: 'PK',
  sortKey: 'SK',
  DocumentClient,
})

export const ChatEntity = new Entity({
  name: 'Chat',
  attributes: {
    id: { partitionKey: true },
    sk: { hidden: true, sortKey: true },
    name: { type: 'string' },
    status: { type: 'string' },
  },
  table: ChatTable,
} as const)
