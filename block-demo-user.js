/**
 * Block demo user subscription
 */

import dbManager from './db-manager.js'

async function blockDemoUser() {
  try {
    console.log('🔒 Blocking demo user subscription...')
    
    const phone = '+998 11 111 11 11'
    const user = await dbManager.getUser(phone)
    
    if (!user) {
      console.log('❌ Demo user not found!')
      return
    }
    
    console.log('📋 Current user status:', {
      phone: user.phone,
      name: user.name,
      subscriptionActive: user.subscriptionActive,
      approved: user.approved
    })
    
    // Block subscription
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    user.subscriptionExpiry = yesterday
    user.subscriptionActive = false
    
    await dbManager.saveUser(phone, user)
    
    console.log('✅ Demo user subscription BLOCKED!')
    console.log('📋 New status:', {
      subscriptionActive: user.subscriptionActive,
      subscriptionExpiry: user.subscriptionExpiry
    })
    
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  }
}

blockDemoUser()
