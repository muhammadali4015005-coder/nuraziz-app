import dbManager from './db-manager.js'

async function createDemoUser() {
  try {
    console.log('Creating demo user...')
    
    const demoUser = {
      phone: '+998 11 111 11 11',
      pass: '1111',
      name: 'DEMO',
      approved: true,
      planCode: 'DEMO123',
      plans: [],
      dailySchedule: [],
      scheduleHistory: [],
      sportGoal: '',
      morningExercises: [],
      eveningExercises: [],
      schedule: {},
      morning: [],
      evening: [],
      goals: [],
      foods: [],
      settings: {
        age: '',
        notes: '',
        sportDays: '',
        morningType: '',
        eveningType: '',
        sportTypes: [],
        sportName: 'Sport',
        weeklySchedule: {
          Monday: { morning: '', evening: '' },
          Tuesday: { morning: '', evening: '' },
          Wednesday: { morning: '', evening: '' },
          Thursday: { morning: '', evening: '' },
          Friday: { morning: '', evening: '' },
          Saturday: { morning: '', evening: '' },
          Sunday: { morning: '', evening: '' }
        }
      },
      nutrition: {
        breakfast: { time: '08:00', water: 0, foods: '' },
        lunch: { time: '12:00', water: 0, foods: '' },
        dinner: { time: '18:00', water: 0, foods: '' }
      },
      nutritionChat: [],
      chatMessages: [],
      subscriptionActive: true,
      subscriptionExpiry: new Date('2026-12-31'),
      createdAt: new Date()
    }
    
    await dbManager.saveUser(demoUser.phone, demoUser)
    console.log('✅ Demo user created successfully!')
    console.log('Phone:', demoUser.phone)
    console.log('Password:', demoUser.pass)
    
  } catch (err) {
    console.error('❌ Error:', err)
  }
  
  process.exit(0)
}

createDemoUser()
