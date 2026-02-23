// DEMO userni qayta faollashtirish
import dbManager from './db-manager.js'

async function unblockDemo() {
    const phone = '+998 11 111 11 11'
    console.log('Unblocking DEMO user...')
    
    const user = await dbManager.getUser(phone)
    if (user) {
        user.subscriptionActive = true
        user.approved = true
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 30)
        user.subscriptionExpiry = expiryDate
        
        await dbManager.saveUser(phone, user)
        console.log('✓ DEMO user unblocked!')
        console.log('Phone:', phone)
        console.log('Pass: 1111')
        console.log('Approved:', user.approved)
        console.log('Active:', user.subscriptionActive)
    } else {
        console.log('✗ DEMO user not found')
    }
    
    await dbManager.close()
    process.exit(0)
}

unblockDemo()
