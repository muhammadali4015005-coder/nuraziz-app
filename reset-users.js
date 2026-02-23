// Userlarni reset qilish - approved=false
import dbManager from './db-manager.js'

async function resetUsers() {
    console.log('Resetting users...')
    
    // Demo user
    const demoPhone = '+998 11 111 11 11'
    const demoUser = await dbManager.getUser(demoPhone)
    if (demoUser) {
        demoUser.approved = false
        await dbManager.saveUser(demoPhone, demoUser)
        console.log('✓ Demo user reset (approved=false)')
    }
    
    // Test user
    const testPhone = '+998 90 123 45 67'
    const testUser = await dbManager.getUser(testPhone)
    if (testUser) {
        testUser.approved = false
        await dbManager.saveUser(testPhone, testUser)
        console.log('✓ Test user reset (approved=false)')
    }
    
    console.log('\n✓ Users reset successfully!')
    console.log('Now they need admin approval to login.')
    
    await dbManager.close()
    process.exit(0)
}

resetUsers()
