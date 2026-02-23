// Test user yaratish
import dbManager from './db-manager.js'

async function createTestUser() {
    const testUser = {
        phone: '+998 90 123 45 67',
        pass: '1234',
        name: 'TEST USER',
        approved: true,
        planCode: 'TEST123',
        plans: [],
        schedule: {},
        morning: [],
        evening: [],
        goals: [],
        foods: [],
        settings: {},
        subscriptionActive: true,
        subscriptionExpiry: new Date('2026-12-31'),
        createdAt: new Date()
    }
    
    console.log('Creating test user...')
    const saved = await dbManager.saveUser(testUser.phone, testUser)
    
    if (saved) {
        console.log('✓ Test user created successfully!')
        console.log('Phone:', testUser.phone)
        console.log('Pass:', testUser.pass)
    } else {
        console.log('✗ Failed to create test user')
    }
    
    await dbManager.close()
    process.exit(0)
}

createTestUser()
