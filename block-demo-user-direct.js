/**
 * Block demo user directly in MongoDB
 */

import { MongoClient } from 'mongodb'

const MONGO_URL = 'mongodb://localhost:27017'
const DB_NAME = 'nuraziz_db'
const COLLECTION_NAME = 'users'

async function blockDemoUser() {
    let client = null
    
    try {
        console.log('🔌 Connecting to MongoDB...')
        client = new MongoClient(MONGO_URL)
        await client.connect()
        
        const db = client.db(DB_NAME)
        const collection = db.collection(COLLECTION_NAME)
        
        const phone = '+998 11 111 11 11'
        
        console.log(`🔍 Finding user: ${phone}`)
        const user = await collection.findOne({ phone })
        
        if (!user) {
            console.log('❌ User not found!')
            return
        }
        
        console.log('📋 Current user data:')
        console.log('  - Name:', user.name)
        console.log('  - Approved:', user.approved)
        console.log('  - subscriptionActive:', user.subscriptionActive)
        
        console.log('\n🔒 Blocking user...')
        const result = await collection.updateOne(
            { phone },
            { 
                $set: { 
                    subscriptionActive: false,
                    approved: true
                } 
            }
        )
        
        console.log('✅ Update result:', result.modifiedCount, 'document(s) modified')
        
        // Verify the update
        const updatedUser = await collection.findOne({ phone })
        console.log('\n✅ Updated user data:')
        console.log('  - Name:', updatedUser.name)
        console.log('  - Approved:', updatedUser.approved)
        console.log('  - subscriptionActive:', updatedUser.subscriptionActive)
        
    } catch (err) {
        console.error('❌ Error:', err.message)
    } finally {
        if (client) {
            await client.close()
            console.log('\n✅ MongoDB connection closed')
        }
    }
}

blockDemoUser()
