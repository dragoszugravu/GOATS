#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb')

async function main() {
  const tableName = process.env.TABLE_NAME
  if (!tableName) throw new Error('TABLE_NAME env var required')
  const region = process.env.AWS_REGION || 'eu-west-1'
  const file = path.join(__dirname, 'players.seed.json')
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))

  const client = new DynamoDBClient({ region })
  const ddb = DynamoDBDocumentClient.from(client)

  for (const p of data) {
    const now = new Date().toISOString()
    const item = {
      pk: `PLAYER#${p.id}`,
      sk: 'META',
      id: p.id,
      name: p.name,
      number: Number(p.number),
      position: p.position,
      bio: p.bio || '',
      imageKey: p.imageKey || null,
      active: p.active !== false,
      createdAt: now,
      updatedAt: now,
      gsi1pk: `POSITION#${p.position}`,
      gsi1sk: p.name,
      gsi2pk: p.number ? `NUMBER#${p.number}` : undefined
    }
    await ddb.send(new PutCommand({ TableName: tableName, Item: item }))
    console.log('Seeded', p.id, p.name)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })


