// Demo user ni tuzatish
import dbManager from './db-manager.js'

async function fixDemoUser() {
    const phone = '+998 11 111 11 11'
    
    console.log('Fixing demo user...')
    const user = await dbManager.getUser(phone)
    
    if (user) {
        user.pass = '1111'
        user.approved = true
        user.subscriptionActive = true
        user.subscriptionExpiry = new Date('2026-12-31')
        
        const saved = await dbManager.saveUser(phone, user)
        
        if (saved) {
            console.log('✓ Demo user fixed successfully!')
            console.log('Phone:', phone)
            console.log('Pass: 1111')
        } else {
            console.log('✗ Failed to fix demo user')
        }
    } else {
        console.log('✗ Demo user not found')
    }
    
    await dbManager.close()
    process.exit(0)
}

fixDemoUser()
