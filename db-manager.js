/**
 * MongoDB Database Manager (ES Module)
 * Saves user accounts permanently
 */

import { MongoClient } from 'mongodb'

const MONGO_URL = 'mongodb://localhost:27017'
const DB_NAME = 'nuraziz_db'
const COLLECTION_NAME = 'users'

let client = null
let db = null
let mongoConnected = false

async function connect() {
    try {
        if (!client) {
            client = new MongoClient(MONGO_URL, { 
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 5000
            })
            await client.connect()
            db = client.db(DB_NAME)
            mongoConnected = true
            console.log('[DB] ✓ MongoDB connected')
        }
        return db
    } catch (err) {
        console.log('[DB] ⚠ MongoDB not available - using file storage')
        mongoConnected = false
        return null
    }
}

async function getUser(phone) {
    try {
        const database = await connect()
        if (database) {
            const collection = database.collection(COLLECTION_NAME)
            const user = await collection.findOne({ phone })
            if (user) {
                console.log(`[DB] ✓ User ${phone} loaded from MongoDB`)
                return user
            }
        }
        
        // Fallback to file-based storage if MongoDB not available
        try {
            const fs = await import('fs')
            const path = await import('path')
            const dataDir = path.join(process.cwd(), 'data')
            const userFile = path.join(dataDir, `${phone.replace(/[^a-zA-Z0-9]/g, '_')}.json`)
            
            if (fs.existsSync(userFile)) {
                const data = fs.readFileSync(userFile, 'utf8')
                console.log(`[DB] ✓ User ${phone} loaded from file`)
                return JSON.parse(data)
            }
        } catch (fileErr) {
            console.log('[DB] ⚠ File storage not available')
        }
        
        console.log(`[DB] ✗ User ${phone} not found`)
        return null
    } catch (err) {
        console.error('[DB] ✗ Error getting user:', err.message)
        return null
    }
}

async function saveUser(phone, userData) {
    try {
        const database = await connect()
        if (database) {
            const collection = database.collection(COLLECTION_NAME)
            
            // Remove _id field if it exists to avoid immutable field error
            const dataToSave = { ...userData }
            delete dataToSave._id
            
            const result = await collection.updateOne(
                { phone },
                { $set: dataToSave },
                { upsert: true }
            )
            
            console.log(`[DB] ✓ User ${phone} saved to MongoDB`)
            return true
        }
        
        // Fallback to file-based storage if MongoDB not available
        try {
            const fs = await import('fs')
            const path = await import('path')
            const dataDir = path.join(process.cwd(), 'data')
            
            // Create data directory if it doesn't exist
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true })
            }
            
            const userFile = path.join(dataDir, `${phone.replace(/[^a-zA-Z0-9]/g, '_')}.json`)
            fs.writeFileSync(userFile, JSON.stringify(userData, null, 2))
            console.log(`[DB] ✓ User ${phone} saved to file`)
            return true
        } catch (fileErr) {
            console.log('[DB] ⚠ File storage not available:', fileErr.message)
        }
        
        return false
    } catch (err) {
        console.error(`[DB] ✗ Error saving user:`, err.message)
        return false
    }
}

async function getAllUsers() {
    try {
        const database = await connect()
        if (database) {
            const collection = database.collection(COLLECTION_NAME)
            const users = await collection.find({}).toArray()
            if (users && users.length > 0) return users
        }
        
        // Fallback to file-based storage if MongoDB not available
        try {
            const fs = await import('fs')
            const path = await import('path')
            const dataDir = path.join(process.cwd(), 'data')
            
            if (fs.existsSync(dataDir)) {
                const files = fs.readdirSync(dataDir)
                const users = []
                
                for (const file of files) {
                    if (file.endsWith('.json')) {
                        const filePath = path.join(dataDir, file)
                        const data = fs.readFileSync(filePath, 'utf8')
                        users.push(JSON.parse(data))
                    }
                }
                
                if (users.length > 0) {
                    console.log(`📦 Loaded ${users.length} users from files`)
                    return users
                }
            }
        } catch (fileErr) {
            console.log('⚠️  File storage not available')
        }
        
        return []
    } catch (err) {
        console.error('Error getting users:', err)
        return []
    }
}

async function deleteUser(phone) {
    try {
        const database = await connect()
        if (!database) return true
        
        const collection = database.collection(COLLECTION_NAME)
        await collection.deleteOne({ phone })
        
        console.log(`✅ Deleted user ${phone} from MongoDB`)
        return true
    } catch (err) {
        console.error(`❌ Error deleting user:`, err.message)
        return false
    }
}

async function getPriceSettings() {
    try {
        const database = await connect()
        if (!database) return { monthlyPrice: 0, discount: 0 }
        
        const collection = database.collection('settings')
        const settings = await collection.findOne({ _id: 'price_settings' })
        
        // Eski 'price' ni 'monthlyPrice' ga o'zgartirish
        if (settings && settings.price && !settings.monthlyPrice) {
            settings.monthlyPrice = settings.price
        }
        
        return settings || { monthlyPrice: 0, discount: 0 }
    } catch (err) {
        console.error('Error getting price settings:', err)
        return { monthlyPrice: 0, discount: 0 }
    }
}

async function savePriceSetting(key, value) {
    try {
        const database = await connect()
        if (!database) return true
        
        const collection = database.collection('settings')
        const result = await collection.updateOne(
            { _id: 'price_settings' },
            { $set: { [key]: value } },
            { upsert: true }
        )
        
        console.log(`✅ Saved ${key}=${value} to MongoDB:`, result)
        return true
    } catch (err) {
        console.error(`❌ Error saving ${key}:`, err.message)
        return false
    }
}

async function close() {
    if (client) {
        await client.close()
        console.log('✅ MongoDB connection closed')
    }
}

export default {
    connect,
    getUser,
    saveUser,
    getAllUsers,
    deleteUser,
    getPriceSettings,
    savePriceSetting,
    close
}
