/**
 * Demo Akkauntni MongoDB da yaratish
 * Run: node init-demo-account.js
 */

import dbManager from './db-manager.js'

async function initDemoAccount() {
    try {
        console.log('🔄 Demo akkaunt yaratilmoqda...')
        
        const demoUser = {
            phone: '+998 90 123 45 67',
            pass: '1234',
            name: 'Demo User',
            approved: true,
            schedule: {},
            morning: [],
            evening: [],
            goals: [],
            foods: [],
            videos: [],
            gallery: [],
            settings: {},
            createdAt: new Date()
        }
        
        const success = await dbManager.saveUser('+998 90 123 45 67', demoUser)
        
        if (success) {
            console.log('✅ Demo akkaunt MongoDB da yaratildi!')
            console.log('📱 Telefon: +998 90 123 45 67')
            console.log('🔐 Parol: 1234')
        } else {
            console.log('❌ Demo akkaunt yaratishda xatolik')
        }
        
        await dbManager.close()
        process.exit(0)
    } catch (err) {
        console.error('❌ Xatolik:', err)
        process.exit(1)
    }
}

initDemoAccount()
